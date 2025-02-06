import { DeepSeekProvider } from "./providers/deepseek";
import { OpenAIProvider } from "./providers/open_ai";
import { OpenRouterProvider } from "./providers/openrouter";
import { AnyModelConfig, DeepSeekModelConfig, ModelConfig, ModelMessage, OpenRouterModelConfig } from "./types";
import ora from 'ora';

export * from './types';

export class Model{

    public modelConfig!: AnyModelConfig;

    private openAiProvider!: OpenAIProvider
    private deepSeekProvider!: DeepSeekProvider
    private openRouterProvider!: OpenRouterProvider


    constructor(config:{
        modelConfig: AnyModelConfig
    }){
        this.modelConfig = config.modelConfig;
    }

    initializeModel(){

        switch(this.modelConfig.provider){
            case 'OPEN_AI':{
                //console.log("initialising openai")

                if(!this.modelConfig.apiKey){
                    throw new Error('OpenAI API Key is missing!');
                }
                this.openAiProvider = new OpenAIProvider(this.modelConfig)

                break;
            }

            case 'DEEP_SEEK':{

                //console.log("initialising deepseek")
                if(!this.modelConfig.apiKey){
                    throw new Error('DEEP SEEK API Key is missing!');
                }
                this.deepSeekProvider = new DeepSeekProvider(this.modelConfig as DeepSeekModelConfig) 
                
                break;
            }

            case 'OPEN_ROUTER':{

                //console.log("initialising deepseek")
                if(!this.modelConfig.apiKey){
                    throw new Error('OPEN ROUTER API Key is missing!');
                }
                this.openRouterProvider = new OpenRouterProvider(this.modelConfig as OpenRouterModelConfig) 
                
                break;
            }
        }
    }

    async sendAndReceiveResponse(messages: ModelMessage[]){

        let response;
        switch(this.modelConfig.provider){
            case 'OPEN_AI':{
                response = await this.openAiProvider.sendAndReceiveResponse(messages)
                break;
            }

            case 'DEEP_SEEK':{
                response = await this.deepSeekProvider.sendAndReceiveResponse(messages)
                break;
            }

            case 'OPEN_ROUTER':{
                response = await this.openRouterProvider.sendAndReceiveResponse(messages)
            }
        }
        
        return response;

    }

}