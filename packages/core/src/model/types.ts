

export type ModelConfig = OpenAIModelConfig;
export type OpenAIModel = 'gpt-4o'

export type OpenAIModelConfig = {
    provider: 'OPEN_AI',
    model: OpenAIModel,
    apiKey: string
}

export type ModelMessage = {
    role: 'system' | 'user',
    content: string
}