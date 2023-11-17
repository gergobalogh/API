import {
    createAuthenticatedClient,
    insertNews,
    selectByTitle,
    selectOneForCalculatingScore,
    selectOneForCompletion,
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
        const news = await selectOneForCompletion();
        if (news !== null) {
            const nullKeys = findNullKeys(news)
            // @ts-ignore
            for (const item of nullKeys) {
                await sleep(1000)
                switch (item) {
                    case "scale":
                        const scale = await determineScale(news.title)
                        if (scale.length === 2) {
                            await updateByTitle(news.title, 'scale', scale)
                        }
                        break;
                    case "magnitude":
                        const magnitude = await determineMagnitude(news.title)
                        if (magnitude.length === 1) {
                            await updateByTitle(news.title, 'magnitude', magnitude)
                        }
                        break;
                    case "potential":
                        const potential = await determinePotential(news.title)
                        if(potential.length === 1) {
                            await updateByTitle(news.title, 'potential', potential)
                        }
                        break;
                    case "novelty":
                        const novelty = await determineNovelty(news.title)
                        if(novelty.length === 1) {
                            await updateByTitle(news.title, 'novelty', novelty)
                        }
                        break;
                    case "significance":
                        const significance = await determineSignificance(news.title)
                        if(significance.length === 1) {
                            await updateByTitle(news.title, 'significance', significance)
                        }
                        break;
                    case "actionability":
                        const actionability = await determineActionability(news.title)
                        if(actionability.length === 1) {
                            await updateByTitle(news.title, 'actionability', actionability)
                        }
                        break;
                    case "longTerm":
                        const longTerm = await determineLongTermConsequences(news.title)
                        if(longTerm.length === 1) {
                            await updateByTitle(news.title, 'longTerm', longTerm)
                        }
                        break;
                    case "category":
                        const category = await determineCategory(news.title)
                        if(category !== 0) {
                            await updateByTitle(news.title, 'category', category)
                        }
                        break;
                    default:
                        break;
                }
            }
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
            await updateByTitle(news.title, 'score', score)
        }
    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}
