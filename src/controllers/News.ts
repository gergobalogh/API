import {Hono} from "hono";
import {getTotalHigherThanSix, getDetailsById, listNews, listStatistics} from "../lib/dbClient.ts";

const News = new Hono();

News.get('/list/:page', async (c) => {
    const page = c.req.param('page')
    const {data, maxPages, error} = await listNews(page)

    return c.jsonT(
        {
            news: data,
            maxPages,
            error,
            page
        }
    )
})
News.get('/item/:id', async (c) => {
    const id = c.req.param('id')
    const news = await getDetailsById(id)
    return c.jsonT(
        {
            ...news
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