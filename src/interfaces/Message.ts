export default interface Message {
    message_id?: Number;
    chat_id: Number;
    user_id: Number;
    human_message: String;
    ai_message: String;
    timestamp?: String;
}