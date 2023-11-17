export interface GPT {
    model: string,
    temperature: number;
    messages: Array<object>,
    functions?: Array<object>
    function_call?: string
    max_tokens?: number

}

export const defaultGPT: GPT = {
    model: 'gpt-3.5-turbo-1106',
    temperature: 0,
    messages: [],
    max_tokens: 1
}