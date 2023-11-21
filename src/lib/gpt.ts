// @ts-ignore
import {OpenAI} from "openai"
import {Logger} from "./logging/logger.ts";
import {defaultGPT, GPT} from "../interfaces/GPT.ts";
import {createLogitBias} from "./helpers.ts";

const gptAPI = new OpenAI(Deno.env.get('OPENAI_API_KEY'))

const callOpenAIAPI = async (gptParams: GPT) => {
    return await gptAPI.chat.completions.create({
        model: gptParams.model,
        messages: gptParams.messages,
        temperature: gptParams.temperature,
        max_tokens: gptParams.max_tokens,
        logit_bias: gptParams.logit_bias
    });
}

function parseResponse(content: string) {
    try {
        const value = JSON.parse(content)
        if(typeof value === "number") {
            if(value >= 0 || value <=10) {
                return value
            } else {
                Logger.error('Value is not in range from 0 to 10')
            }
        } else {
            Logger.error('Value returned from GPT API not number')
        }
    } catch (err) {
        if(typeof err === "string") {
            Logger.error(err)
        }
    }
}

export const determineScale = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages: [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă deloc semnificativ pentru Romania, iar 10 înseamnă extrem de semnificativ. Răspunde DOAR cu un nota."
            },
            {"role": "user", "content": message},
        ]
    })
    console.log(result)
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}
export const determineMagnitude = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă un eveniment neînsemnat, iar 10 înseamnă un eveniment de o importanță extraordinară sau extrem de grav. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}
export const determinePotential = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă foarte puțin potențial de a provoca evenimente mai mari și 10 înseamnă un potențial extrem de mare de a avea consecințe semnificative și de a genera evenimente ulterioare importante. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}

export const determineNovelty = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă un eveniment total previzibil și 10 înseamnă un eveniment complet neașteptat sau unic în contextul său. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}

export const determineSignificance = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10,  unde 0 înseamnă că evenimentul are un impact minim asupra umanității și 10 înseamnă că are un impact maxim, afectând semnificativ comunitățile și societatea în ansamblu. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}

export const determineActionability = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10 evaluează capacitatea de acționare a cititorului, unde 0 înseamnă că evenimentul oferă puține sau niciun fel de posibilități de acțiune pentru cititori, iar 10 înseamnă că evenimentul oferă oportunități semnificative pentru cititori să acționeze în beneficiul personal sau comunitar. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        return ''
    }
}

export const determineLongTermConsequences = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages:  [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Notează evenimentul prezentat în titlul de știre pe o scară de la 0 la 10, unde 0 înseamnă consecințe minime sau deloc semnificative, iar 10 înseamnă consecințe majore cu impact semnificativ asupra legislației, politicii sau societății în general. Răspunde DOAR cu nota."
            },
            {"role": "user", "content": message},
        ]
    })

    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}
export const translateDate = async (message: string) => {

    const result = await callOpenAIAPI({
        ...defaultGPT,
        max_tokens: 25,
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
        Logger.error(result.choices[0].message.content)
        return ''
    }
}
export const determineCategory = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        logit_bias: createLogitBias(),
        messages: [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. In ce categorie se  încadrează titlul: \n 1: business, 2: sănătate, 3: tehnologie, 4: sport, 5: divertisment, 6: economie, 7: națiune. Răspunde DOAR cu categoria."
            },
            {
                "role": "user",
                "content": message
            }
        ]
    })
    if (result.choices[0].finish_reason === 'length' && result.choices[0].message.content) {
        return parseResponse(result.choices[0].message.content)
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}
export const rewriteTitle = async (message: string) => {
    const result = await callOpenAIAPI({
        ...defaultGPT,
        max_tokens: 250,
        messages: [
            {
                "role": "system",
                "content": "Ești un redactor șef de știri. Rescrie următorul titlu de știri pentru a fi clar, concis și eliminănd clickbait-ul. Răspunde DOAR cu titlul."
            },
            {
                "role": "user",
                "content": message
            }
        ]
    })
    if (result.choices[0].finish_reason === 'stop' && result.choices[0].message.content) {
        return result.choices[0].message.content
    } else {
        Logger.error(result.choices[0].message.content)
        return ''
    }
}

export const generateEmbeddings = async (title: string) => {
    const result = await gptAPI.embeddings.create({
        model: "text-embedding-ada-002",
        input: title,
        encoding_format: 'float'
    })
    return result.data[0].embedding
}