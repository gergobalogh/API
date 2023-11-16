import {Hono} from "hono";
import {sleep} from "../lib/helpers.ts";
import {listNews} from "../lib/dbClient.ts";

const News = new Hono();
News.get('/list', async (c) => {
    const newslist = await listNews()

    return c.jsonT(
        {
            news: newslist
        }
    )
})
export {
    News
}