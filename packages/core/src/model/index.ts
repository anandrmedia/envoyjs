import { OpenAIProvider } from "./providers/open_ai";
import { ModelConfig, ModelMessage } from "./types";

export * from './types';

export class Model{

    public modelConfig!: ModelConfig;

    private openAiProvider!: OpenAIProvider

    constructor(config:{
        modelConfig: ModelConfig
    }){
        this.modelConfig = config.modelConfig;
    }

    initializeModel(){

        switch(this.modelConfig.provider){
            case 'OPEN_AI':{
                this.openAiProvider = new OpenAIProvider(this.modelConfig)
            }
        }
    }

    async sendAndReceiveResponse(messages: ModelMessage[]){

        let response;

        switch(this.modelConfig.provider){
            case 'OPEN_AI':{
                response = await this.openAiProvider.sendAndReceiveResponse(messages)
            }
        }
        
        return response;

    }

}