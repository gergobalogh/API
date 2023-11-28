import {Hono} from "hono";
import {sleep} from "../lib/helpers.ts";
import {getTotalHigherThanSix, getDetailsById, listNews, listStatistics} from "../lib/dbClient.ts";

const News = new Hono();
News.get('/list/', async (c) => {
    const news = await listNews()
    return c.jsonT(
        {
            news: news
        }
    )
})
News.get('/list/:date', async (c) => {
    const date = c.req.param('date')
    const news = await listNews(date)

    return c.jsonT(
        {
            news: news
        }
    )
})
News.get('/list/list/:id', async (c) => {
    const id = c.req.param('id')
    const news = await getDetailsById(id)
    return c.jsonT(
        {
            newsItem: news
        }
    )
})
News.get('/statistics', async (c) => {
    const statistics = await listStatistics()
    const total = await getTotalHigherThanSix()
    return c.jsonT(
        {
            newsRead: statistics[0].total_processed,
            nrOfNewsWithHighScore: total
        }
    )
})
export {
    News
}