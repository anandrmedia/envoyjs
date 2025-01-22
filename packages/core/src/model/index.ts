import { DeepSeekProvider } from "./providers/deepseek";
import { OpenAIProvider } from "./providers/open_ai";
import { AnyModelConfig, DeepSeekModelConfig, ModelConfig, ModelMessage } from "./types";

export * from './types';

export class Model{

    public modelConfig!: AnyModelConfig;

    private openAiProvider!: OpenAIProvider
    private deepSeekProvider!: DeepSeekProvider


    constructor(config:{
        modelConfig: AnyModelConfig
    }){
        this.modelConfig = config.modelConfig;
    }

    initializeModel(){

        switch(this.modelConfig.provider){
            case 'OPEN_AI':{

                if(!this.modelConfig.apiKey){
                    throw new Error('OpenAI API Key is missing!');
                }
                this.openAiProvider = new OpenAIProvider(this.modelConfig)
            }

            case 'DEEP_SEEK':{
                if(!this.modelConfig.apiKey){
                    throw new Error('DEEP SEEK API Key is missing!');
                }
                this.deepSeekProvider = new DeepSeekProvider(this.modelConfig as DeepSeekModelConfig)  
            }
        }
    }

    async sendAndReceiveResponse(messages: ModelMessage[]){

        let response;

        switch(this.modelConfig.provider){
            case 'OPEN_AI':{
                response = await this.openAiProvider.sendAndReceiveResponse(messages)
            }

            case 'DEEP_SEEK':{
                response = await this.deepSeekProvider.sendAndReceiveResponse(messages)
            }
        }
        
        return response;

    }

}