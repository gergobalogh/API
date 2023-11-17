import {Hono} from "hono";
import {cors} from "cors"
import {News} from "./src/controllers/News.ts";
import {calculateScore, getAttributeValues, getNews, test} from "./src/crons/cronjob.ts";

const app = new Hono()

// Deno.cron("Fetch news", "0 */2 * * *", () => {
//     console.log("Getting the news");
//     getNews()
// });
Deno.cron("Get attributes", "* * * * *", () => {
    getAttributeValues()
})
Deno.cron("Calculate score", "*/2 * * * *", () => {
    calculateScore()
})
app.use('/*', cors({
    origin: 'https://flat-goat-98.deno.dev/',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
}))
app.route('/news', News)

// @ts-ignore
Deno.serve(app.fetch)
