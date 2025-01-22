
export const ModelType = {
    OpenAI: 'openai',
    DeepSeek: 'deepseek'
  } as const;

  type ModelType = typeof ModelType[keyof typeof ModelType];


export type AnyModelConfig = ModelConfig<ModelType>;

export type ModelConfig<T extends ModelType> = T extends typeof ModelType.OpenAI 
  ? OpenAIModelConfig 
  : DeepSeekModelConfig;

export type OpenAIModel = 'gpt-4o' 
export type DeepSeekModel = 'deepseek-chat'

export type OpenAIModelConfig = {
    provider: 'OPEN_AI',
    model: OpenAIModel,
    apiKey: string
}

export type DeepSeekModelConfig = {
    provider: 'DEEP_SEEK',
    model: DeepSeekModel,
    apiKey: string
}

export type ModelMessage = {
    role: 'system' | 'user',
    content: string
}