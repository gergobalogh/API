import dbClient from "../lib/db/DbClient.ts";
import {generateUsername} from "../lib/helpers.ts";



export default {
    tableName: 'users',
    add: async () => {
        let userName = generateUsername();
        return await dbClient.query(
            `INSERT INTO users(username) values(?)`,
            [userName],
        );
    },
};