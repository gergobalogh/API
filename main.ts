import {Hono} from "hono";
import {cors} from "cors"
import {News} from "./src/controllers/News.ts";
import {
    calculateScore,
    deduplicateTitles,
    getAttributeValues, getBizidayNews,
    getG4News
} from "./src/crons/cronjob.ts";
const app = new Hono()

Deno.cron("Fetch news", "0 */2 * * *", () => {
    console.log("Getting the news");
    getG4News()
    getBizidayNews()
});
Deno.cron("Get attributes", "* * * * *", () => {
    getAttributeValues()
})
Deno.cron("Calculate score", "*/2 * * * *", () => {
    calculateScore()
})
// Deno.cron("Deduplicate titles", "*/5 * * * *", () => {
//     deduplicateTitles()
// })
app.use('/*', cors({
    origin: 'http://127.0.0.1:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
}))
app.route('/news', News)

// @ts-ignore
Deno.serve(app.fetch)
