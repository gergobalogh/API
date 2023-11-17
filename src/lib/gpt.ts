// @ts-ignore
import {OpenAI} from "openai"
import {Logger} from "./logging/logger.ts";
import {functionManager} from "../service/functionMananagerService.ts";
import {defaultGPT} from "../interfaces/GPT.ts";
import {GPT} from "../interfaces/GPT.ts";

const gptAPI = new OpenAI(Deno.env.get('OPENAI_API_KEY'))


const callOpenAIAPI = async (gptParams: GPT) => {
    Logger.info('Calling OpenAI API')
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
    const functionName = functionToBeCalled.name
    const functionArgs = functionToBeCalled.arguments
    return await functionManager.executeFunction(functionName, functionArgs);
}
export const determineScale = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages: [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă deloc semnificativ pentru Romania, iar 10 înseamnă extrem de semnificativ. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}
export const determineMagnitude = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă un eveniment neînsemnat, iar 10 înseamnă un eveniment de o importanță extraordinară sau extrem de grav. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}
export const determinePotential = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă foarte puțin potențial de a provoca evenimente mai mari și 10 înseamnă un potențial extrem de mare de a avea consecințe semnificative și de a genera evenimente ulterioare importante. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}

export const determineNovelty = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă un eveniment total previzibil și 10 înseamnă un eveniment complet neașteptat sau unic în contextul său. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}

export const determineSignificance = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă că evenimentul are un impact minim asupra umanității și 10 înseamnă că are un impact maxim, afectând semnificativ comunitățile și societatea în ansamblu. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}

export const determineActionability = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10 evaluează capacitatea de acționare a cititorului, unde 0 înseamnă că evenimentul oferă puține sau niciun fel de posibilități de acțiune pentru cititori, iar 10 înseamnă că evenimentul oferă oportunități semnificative pentru cititori să acționeze în beneficiul personal sau comunitar. Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}

export const determineLongTermConsequences = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă consecințe minime sau deloc semnificative, iar 10 înseamnă consecințe majore cu impact semnificativ asupra legislației, politicii sau societății în general.  Răspunde cu un număr."
            },
            {"role": "user", "content": message},
        ]
    })

    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return 0
    }
}
export const translateDate = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages:  [
            {
                "role": "system",
                "content": "Translate this date into english"
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return result.choices[0].message.content
    } else {
        return ''
    }
}
export const determineCategory = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        messages: [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. In ce categorie se  încadrează titlul: \n 1 business, 2 sănătate, 3 tehnologie, 4 sport, 5 divertisment, 6 economie, 7 națiune. Răspunde cu un număr."
            },
            {
                "role": "user",
                "content": message
            }
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return JSON.parse(result.choices[0].message.content)
    } else {
        return ''
    }
}
