import {Hono} from "hono";
import {cors} from "cors"
import {News} from "./src/controllers/News.ts";
const app = new Hono()
app.use('/*', cors({
    origin: 'http://127.0.0.1:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
}))
app.route('/news', News)

// @ts-ignore
Deno.serve(app.fetch)
