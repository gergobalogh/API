// @ts-ignore
import {Hono} from "hono";
// @ts-ignore
import {cors} from "cors"
import {Cron} from "cron";
import {News} from "./src/controllers/News.ts";
import * as cheerio from "cheerio";
import {
    determineActionability, determineCategory, determineLongTermConsequences,
    determineMagnitude, determineNovelty, determinePotential,
    determineScale, determineSignificance, translateDate
} from "./src/lib/gpt.ts"
import {calculateFinalScore, calculateTimeDifference, findNullKeys, isEmpty, sleep} from "./src/lib/helpers.ts"
import {
    insertNews,
    selectByTitle,
    selectOneForCalculatingScore,
    selectOneForCompletion,
    updateByTitle
} from "./src/lib/dbClient.ts";
import {Logger} from "./src/lib/logging/logger.ts";

const app = new Hono()

const getNews = async () => {
    try {
        const url = 'https://www.g4media.ro/'
        const news = await fetch(url)
        const html = await news.text()
        const $ = cheerio.load(html)
        $('.post-review').each(async (index, element) => {
            if (index < 5) {
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
//getNews();
const getAttributeValues = async () => {
    try {
        const news = await selectOneForCompletion();
        if(news !== null) {
           const nullKeys = findNullKeys(news)
            // @ts-ignore
            for (const item of nullKeys) {
                await sleep(1000)
                switch (item) {
                    case "scale":
                        const scale = await determineScale(news.title)
                        await updateByTitle(news.title, 'scale', scale)
                        break;
                    case "magnitude":
                        const magnitude = await determineMagnitude(news.title)
                        await updateByTitle(news.title, 'magnitude', magnitude)
                        break;
                    case "potential":
                        const potential = await determinePotential(news.title)
                        await updateByTitle(news.title, 'potential', potential)
                        break;
                    case "novelty":
                         const novelty = await determineNovelty(news.title)
                         await updateByTitle(news.title, 'novelty', novelty)
                        break;
                    case "significance":
                        const significance = await determineSignificance(news.title)
                        await updateByTitle(news.title, 'significance', significance)
                        break;
                    case "actionability":
                        const actionability = await determineActionability(news.title)
                        await updateByTitle(news.title, 'actionability', actionability)
                        break;
                    case "longTerm":
                        const longTerm = await determineLongTermConsequences(news.title)
                        await updateByTitle(news.title, 'longTerm', longTerm)
                        break;
                    case "category":
                         const category = await determineCategory(news.title)
                         await updateByTitle(news.title, 'category', category)
                        break;
                    default:
                        // Handle the default case (optional)
                        console.log("Handling default case");
                        break;
                }
            }
        }
    } catch (err) {
        console.log(err)
    }






}
//getAttributeValues();
const calculateScore = async () => {
    try {
        console.log('trying to get data')
        const news = await selectOneForCalculatingScore();
        console.log(news)
    } catch (err) {
        console.log(err.message)
        Logger.error(err.message)
    }
}
// calculateScore()
app.use('/*', cors({
    origin: 'http://127.0.0.1:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
}))
app.route('/news', News)

// @ts-ignore
Deno.serve(app.fetch)
