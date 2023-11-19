import {
    insertNews,
    selectByTitle,
    selectOneForCalculatingScore,
    selectTwoforCompletion,
    updateByTitle
} from "../lib/dbClient.ts";
import {calculateFinalScore, calculateTimeDifference, findNullKeys, isEmpty, sleep} from "../lib/helpers.ts";
import {
    determineActionability, determineCategory, determineLongTermConsequences,
    determineMagnitude,
    determineNovelty,
    determinePotential,
    determineScale,
    determineSignificance,
    translateDate
} from "../lib/gpt.ts";
import {Logger} from "../lib/logging/logger.ts";
import * as cheerio from "cheerio";


export const getNews = async () => {
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
                const doesExist = await selectByTitle(title)
                await sleep(1000)
                if (isEmpty(doesExist)) {
                    const translatedDate = await translateDate(date)
                    const transformDate = calculateTimeDifference(translatedDate)
                    if (transformDate.proximity === "today" || transformDate.proximity === "yesterday" || transformDate.proximity === "tomorrow") {
                        await insertNews(title, href, transformDate.hours.toString())
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
                                await updateByTitle(item.title, 'scale', scale)
                            }
                            break;
                        case "magnitude":
                            const magnitude = await determineMagnitude(item.title)
                            if (typeof magnitude === "number") {
                                await updateByTitle(item.title, 'magnitude', magnitude)
                            }
                            break;
                        case "potential":
                            const potential = await determinePotential(item.title)
                            if (typeof potential ===  "number") {
                                await updateByTitle(item.title, 'potential', potential)
                            }
                            break;
                        case "novelty":
                            const novelty = await determineNovelty(item.title)
                            if (typeof novelty === "number") {
                                await updateByTitle(item.title, 'novelty', novelty)
                            }
                            break;
                        case "significance":
                            const significance = await determineSignificance(item.title)
                            if (typeof significance === "number") {
                                await updateByTitle(item.title, 'significance', significance)
                            }
                            break;
                        case "actionability":
                            const actionability = await determineActionability(item.title)
                            if (typeof actionability === "number") {
                                await updateByTitle(item.title, 'actionability', actionability)
                            }
                            break;
                        case "longTerm":
                            const longTerm = await determineLongTermConsequences(item.title)
                            if (typeof longTerm === "number") {
                                await updateByTitle(item.title, 'longTerm', longTerm)
                            }
                            break;
                        case "category":
                            const category = await determineCategory(item.title)
                            if (typeof category === "number") {
                                await updateByTitle(item.title, 'category', category)
                            }
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
            await updateByTitle(news.title, 'score', score)
        }
    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}
