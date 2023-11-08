import dbClient from "../lib/db/DbClient.ts";
import Chat from "../interfaces/Chat.ts";


export default {
    tableName: 'chat',
    /**
     * Adds a new chat to the database
     * @param {number} user_id - Chat ID
     */
    add: async (user_id: number) => {
        return await dbClient.query(
            `INSERT INTO chat (user_id) values(?)`,
            [user_id]
        );
    },
    updateSuccess: async (chatId: Number, success: Number) => {
        return await dbClient.query(
            `UPDATE chat SET success=? WHERE id=?`,
            [success, chatId]
        );
    },

    updateLanguage: async (chatId: Number, language: String) => {
        return await dbClient.query(
            `UPDATE chat SET language=? WHERE id=?`,
            [language, chatId]
        );
    },
    getLanguageByChatId: async (chatId: Number) => {
        return await dbClient.query(
            `SELECT language FROM chat WHERE id=? LIMIT 1`,
            [ chatId]
        );
    },

};

