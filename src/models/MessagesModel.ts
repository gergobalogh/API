import dbClient from "../lib/db/DbClient.ts";
import Message from "../interfaces/Message.ts";

export default {

    getAllByConversationId: async (chat_id: number) => {
        return await dbClient.query(`SELECT * FROM messages WHERE chat_id=? ORDER BY timestamp ASC`,
            [
                chat_id
            ]);
    },
    add: async (message: Message) => {
        return await dbClient.query(
            `INSERT INTO messages(chat_id, user_id, human_message, ai_message) VALUES (?, ?, ?, ?)`,
            [message.chat_id, message.user_id, message.human_message, message.ai_message]
        );
    },
};
