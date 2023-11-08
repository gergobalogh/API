// @ts-ignore
import { Hono } from "hono";
import {ChatController} from "./src/controllers/ChatController.ts";
import {UserController} from "./src/controllers/UserController.ts";
import runVersioning from "./src/lib/db/versioning.ts";
// @ts-ignore
import { cors } from "cors"

const app = new Hono()

runVersioning()

app.use('/*', cors({
    origin: 'http://127.0.0.1:5173',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

app.route('/user', UserController)

app.route('/chat', ChatController)

// @ts-ignore
Deno.serve(app.fetch)
