// @ts-ignore
import { Hono } from "hono";
import User from "../interfaces/User.ts";
import UserModel from "../models/UserModel.ts";

const UserController = new Hono();
UserController.get('/create', async (c: { jsonT: (arg0: { userId: any; }) => User | PromiseLike<User>; }): Promise<User> => {
    const user =  await UserModel.add()
    return c.jsonT({ userId: user.lastInsertId })

})
export {
    UserController
}