// @ts-ignore
import {Hono} from "hono";
import MessagesModel from "../models/MessagesModel.ts";
import Message from "../interfaces/Message.ts";
import gpt from "../lib/gpt.ts";
import ChatModel from "../models/ChatModel.ts";

const ChatController = new Hono();

ChatController.post('/start', async (c: { req: { json: () => any; }; jsonT: (arg0: { chatId: any; }) => any; }) => {
    const body = await c.req.json()
    const userId = body.userId
    const chat = await ChatModel.add(userId)
    return c.jsonT({chatId: chat.lastInsertId})

})

ChatController.post('/chat', async (c: { req: { json: () => any; }; jsonT: (arg0: { ai_message: any; askForSuccess: boolean; }) => any; }) => {
    const body = await c.req.json()
    const chatId = body.chatId
    const userMessage = body.message
    const userId = body.userId
    const pastMessages = await MessagesModel.getAllByConversationId(chatId)
    let messageWithHistory = userMessage;
    let conversation = ''
    let language;
    if(pastMessages.length > 0) {
        language = (await ChatModel.getLanguageByChatId(chatId))[0].language

        pastMessages.forEach((message: Message)=> {
            conversation += `Q: ${message.human_message}\n`;
            conversation += `A: ${message.ai_message}\n`;
        })
        conversation += `Q: ${userMessage}\n`;
        messageWithHistory = await gpt.mergeHistory(userMessage, conversation, language)
    } else {
        language = await gpt.determineLanguage(userMessage)
        await ChatModel.updateLanguage(chatId, language)
    }

    const result = await gpt.answerQuestion(messageWithHistory, language)
    let message: Message = {
        chat_id: chatId,
        user_id:userId,
        human_message: userMessage,
        ai_message: result.ai_message,
    }
    await MessagesModel.add(message);
    return c.jsonT({ ai_message: result.ai_message, askForSuccess: result.askForSuccess })
    // return c.jsonT({ai_message: '', askForSuccess: false})
})
ChatController.post('/success', async (c: { req: { json: () => any; }; jsonT: (arg0: { success: boolean; }) => any; }) => {
    const body = await c.req.json()
    const chatId = body.chatId
    const success = body.success
    const response = await ChatModel.updateSuccess(chatId, success);
    return c.jsonT({success: true})

})
export {ChatController}