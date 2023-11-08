// @ts-ignore
import {OpenAI} from "openai"
import logger from "./logging/logger.ts";
import {functionManager} from "../service/functionMananagerService.ts";
import {defaultGPT} from "../interfaces/GPT.ts";
import {GPT} from "../interfaces/GPT.ts";
import englishFunctions from "../gptFunctions/functions.english.ts"
// @ts-ignore
const gptAPI = new OpenAI(Deno.env.get('OPENAI_API_KEY'))


const callOpenAIAPI = async (gptParams: GPT) => {
    logger.logGpt('Calling OpenAI API')
    // @ts-ignore
    gptParams.messages.forEach(({content, role}) => {
        logger.logGpt('Prompt used:\n' + 'Role: ' + role + '\n Content: ' + content)
    })
    const result = await gptAPI.createChatCompletion({
        model: gptParams.model,
        messages: gptParams.messages,
        temperature: gptParams.temperature,
        functions: gptParams.functions
    })
    console.log(result)
    return result;
}
const processFunctionCall = async (functionToBeCalled: { name: string; arguments: any; }) => {
    logger.logGpt('Gpt decided that we should call a function: ' + functionToBeCalled.name)
    const functionName = functionToBeCalled.name
    const functionArgs = functionToBeCalled.arguments
    return await functionManager.executeFunction(functionName, functionArgs);
}
const determineLanguage = async (message: string) => {
    const messages = [
        {
            "role": "system",
            "content": 'Given the following text give me what language is it in. Respond with the langauge in JSON.'
        },
        {"role": "user", "content": message},
    ];
    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages: messages
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        const {language} = JSON.parse(result.choices[0].message.content)
        return language
    } else {
        return 'french'
    }
}
const mergeHistory = async (message: string, history: string, language: string) => {
    const fileName = 'src/prompts/history/merge.' + language.toLowerCase() + '.txt'
    // @ts-ignore
    const template: string = await Deno.readTextFile(fileName)
    const contentFileName = 'src/prompts/history/summarize.' + language.toLowerCase() + '.txt'
    // @ts-ignore
    const summarizePrompt: string = await Deno.read(contentFileName)
    const prompt = template
        .replace("${history}", history)
        .replace("${question}", message)
    const messages = [
        {
            "role": "system",
            "content": summarizePrompt
        },
        {"role": "user", "content": prompt},
    ];
    const chatCompletion = await callOpenAIAPI({
        ...defaultGPT, messages: messages
    });
    const responseMessage = {
        gptResponse: chatCompletion.choices[0].message.content,
    }
    return responseMessage.gptResponse
}

const answerQuestion = async (question: string, language: string) => {
    const fileName = 'src/prompts/prompt.' + language.toLowerCase() + '.txt'
    // @ts-ignore
    const template = await Deno.readTextFile('src/prompts/prompt.english.txt')
    const prompt = template
        .replace("${question}", question)
    const gptParams: GPT = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "You are a helpful assistant." + (language ? 'Translate your answers to ' + language.toLowerCase() +  '.' : '')
            },
            {"role": "user", "content": prompt}
        ],
        temperature: 0.7,
        functions: [
            englishFunctions.get_invoice_id
        ],

        function_call: "auto"
    }
    const result = await callOpenAIAPI(gptParams)
    const responseMessage = result.choices[0].message.content
    logger.logGpt('Response: ' + responseMessage)
    const gptResponse = {
        ai_message: responseMessage,
        askForSuccess: false
    }
    if (result.choices[0].finish_reason === 'function_call' && result.choices[0].message.function_call) {
        const functionResponse = await processFunctionCall(result.choices[0].message.function_call)
        logger.logGpt(`Function Execution Response: ${functionResponse}`);
        const formatFunctionResponse = await callOpenAIAPI({
            ...defaultGPT, messages: [
                {
                    "role": "system", "content":
                        "Please rewrite the following text"
                        + (language ? ' in ' + language : '')
                        + " to include the invoice id"
                },
                {"role": "user", "content": functionResponse},
                {"role": "user", "content": JSON.stringify(result.choices[0].message.function_call.arguments)}
            ],
        })
        gptResponse.ai_message = formatFunctionResponse.choices[0].message.content
        gptResponse.askForSuccess = true
    }
    return gptResponse
}
export default {
    mergeHistory,
    answerQuestion,
    determineLanguage
}