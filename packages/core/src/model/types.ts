
export const ModelType = {
    OpenAI: 'openai',
    DeepSeek: 'deepseek',
    OpenRouter: 'openrouter'
  } as const;

  type ModelType = typeof ModelType[keyof typeof ModelType];


export type AnyModelConfig = ModelConfig<ModelType>;

export type ModelConfig<T extends ModelType> = T extends typeof ModelType.OpenAI 
  ? OpenAIModelConfig :  T extends typeof ModelType.OpenRouter ? OpenRouterModelConfig :  DeepSeekModelConfig;

export type OpenAIModel = 'gpt-4o' 
export type DeepSeekModel = 'deepseek-chat'
export type OpenRouterModel = 'openai/gpt-4o' | 'deepseek/deepseek-chat' | 'anthropic/claude-3.5-sonnet'

export type OpenRouterModelConfig = {
  provider: 'OPEN_ROUTER',
    model: OpenRouterModel,
    apiKey: string
}

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

export type ModelExtendedContent = {
  type: "text" | "image_url",
  text?: string
  image_url?: {
    url: string
  }
}
export type ModelMessage = {
    role: 'system' | 'user',
    content: string | ModelExtendedContent[]
}