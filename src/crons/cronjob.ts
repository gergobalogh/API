import {
    insertNews, insertNewsWithDuplicates, insertNiuz,
    selectByTitle,
    selectOneForCalculatingScore, selectOneForEmbedding,
    selectTwoforCompletion,
    updateById, updateProcessed
} from "../lib/dbClient.ts";
import {calculateFinalScore, calculateTimeDifference, findNullKeys, isEmpty, sleep} from "../lib/helpers.ts";
import {
    determineActionability, determineCategory, determineLongTermConsequences,
    determineMagnitude,
    determineNovelty,
    determinePotential,
    determineScale,
    determineSignificance, generateEmbeddings, rewriteTitle,
    translateDate
} from "../lib/gpt.ts";
import {Logger} from "../lib/logging/logger.ts";
import * as cheerio from "cheerio";
import {deleteVectors, insertVector, searchVector} from "../lib/milvus.ts";

export const getG4News = async () => {
    try {
        const url = 'https://www.g4media.ro/'
        const news = await fetch(url)
        const html = await news.text()
        const $ = cheerio.load(html)
        $('.post-review').each(async (index, element) => {
            if (index < 100) {
                const title = $(element).find('.post-title a').text().trim();
                const href = $(element).find('.post-title a').attr('href');
                const date = $(element).find('.entry-date').text().trim()
                const doesExist = await selectByTitle(title, 'G4Media')
                await sleep(1000)
                if (isEmpty(doesExist)) {
                    const translatedDate = await translateDate(date)
                    const transformDate = calculateTimeDifference(translatedDate)
                    if (transformDate.proximity === "today" || transformDate.proximity === "yesterday" || transformDate.proximity === "tomorrow") {
                        await insertNewsWithDuplicates(title, href, translatedDate, 'G4Media')
                        console.log(`Title ${index + 1}: ${title}`);
                        console.log(`Link ${index + 1}: ${href}`);
                    }
                }
            }
        });

    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}

export const getBizidayNews = async () => {
    try {
        const url = 'https://www.biziday.ro/'
        const news = await fetch(url)
        const html = await news.text()
        const $ = cheerio.load(html)
        $('.article:not(.is-ad)').each(async (index, element) => {
            const title = $(element).find('.post-title span').text().trim();
            const href = $(element).find('.post-url').attr('href');
            const date = $(element).find('.timeago').attr('datetime')
            const doesExist = await selectByTitle(title, 'Biziday')
            await sleep(1000)
            if (isEmpty(doesExist)) {
                const dateObject = new Date(date);
                const formattedDate = dateObject.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                await insertNewsWithDuplicates(title, href, formattedDate, 'Biziday')
                console.log(`Title ${index + 1}: ${title}`);
                console.log(`Link ${index + 1}: ${href}`);
            }
        });
    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}

export const getAttributeValues = async () => {
    try {
        const news = await selectTwoforCompletion();
        if (Array.isArray(news)) {
            // @ts-ignore
            news.forEach(async (item) => {
                await sleep(1000)
                const nullKeys = findNullKeys(item)
                // @ts-ignore
                for (const missingAttribute of nullKeys) {
                    await sleep(1000)
                    switch (missingAttribute) {
                        case "scale":
                            const scale = await determineScale(item.title)
                            if (typeof scale === "number") {
                                await updateById(item.id, 'scale', scale)
                            }
                            break;
                        case "magnitude":
                            const magnitude = await determineMagnitude(item.title)
                            if (typeof magnitude === "number") {
                                await updateById(item.id, 'magnitude', magnitude)
                            }
                            break;
                        case "potential":
                            const potential = await determinePotential(item.title)
                            if (typeof potential === "number") {
                                await updateById(item.id, 'potential', potential)
                            }
                            break;
                        case "novelty":
                            const novelty = await determineNovelty(item.title)
                            if (typeof novelty === "number") {
                                await updateById(item.id, 'novelty', novelty)
                            }
                            break;
                        case "significance":
                            const significance = await determineSignificance(item.title)
                            if (typeof significance === "number") {
                                await updateById(item.id, 'significance', significance)
                            }
                            break;
                        case "actionability":
                            const actionability = await determineActionability(item.title)
                            if (typeof actionability === "number") {
                                await updateById(item.id, 'actionability', actionability)
                            }
                            break;
                        case "longTerm":
                            const longTerm = await determineLongTermConsequences(item.title)
                            if (typeof longTerm === "number") {
                                await updateById(item.id, 'longTerm', longTerm)
                            }
                            break;
                        case "category":
                            const category = await determineCategory(item.title)
                            if (typeof category === "number") {
                                await updateById(item.id, 'category', category)
                            }
                            break;
                        case "new_title":
                            const newTitle = await rewriteTitle(item.title)
                            await updateById(item.id, 'new_title', newTitle)
                            break;
                        case "score":
                            break
                        default:
                            break;
                    }
                }
            })

        }


    } catch (err) {
        console.log(err)
    }


}

export const calculateScore = async () => {
    try {
        const news = await selectOneForCalculatingScore();
        if (news !== null) {
            const score = calculateFinalScore(
                news.scale,
                news.magnitude,
                news.potential,
                news.novelty,
                news.significance,
                news.actionability,
                news.longTerm,
            )
            Logger.info(news.title)
            Logger.info('Calculated score: ' + score)
            await updateById(news.title, 'score', score)
        }
    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}

export const deduplicateTitles = async () => {
    try {
        const news = await selectOneForEmbedding()
        if (news !== null) {
            const titleEmbeddings = await generateEmbeddings(news.title)
            const alreadyExists = await searchVector(titleEmbeddings)
            if (alreadyExists === false) {
                await insertNiuz(news.title, news.url, news.proximity, news.site)
            }
            const insert = await insertVector(titleEmbeddings)
            await updateProcessed(news.id, insert.data.insertIds[0])
       }
    } catch (err) {
        console.log(err)
    }
}