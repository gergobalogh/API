import {Hono} from "hono";
import {sleep} from "../lib/helpers.ts";
import {getTotalHigherThanSix, listNews, listStatistics} from "../lib/dbClient.ts";

const News = new Hono();
News.get('/list', async (c) => {
    const news = await listNews()

    return c.jsonT(
        {
            news: news
        }
    )
})
News.get('/statistics', async (c) => {
    const statistics = await listStatistics()
    const total = await getTotalHigherThanSix()

    return c.jsonT(
        {
            newsRead: statistics.titles_read,
            nrOfNewsWithHighScore: total
        }
    )
})
export {
    News
}