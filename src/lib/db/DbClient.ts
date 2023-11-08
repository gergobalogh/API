import createDataBaseClient from "./createDataBaseClient.ts";

const dbClient = await createDataBaseClient('mariadb', 'root', 'auximus', 'gpt_chatbot')
export default dbClient;