import OpenAI from "openai";
import { DeepSeekModel, ModelConfig, ModelMessage, ModelType, OpenAIModel } from "@/model/types";
import { AgentResponse } from "@/agent/types";


export class DeepSeekProvider{

    private client!: OpenAI;
    private model!: DeepSeekModel

    constructor(config: ModelConfig<typeof ModelType.DeepSeek>){
        this.client = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: config.apiKey,
        })

        this.model = config.model
    }

    async sendAndReceiveResponse(messages: ModelMessage[]): Promise<AgentResponse>{

        try{
        const response = await this.client.chat.completions.create({
            messages,
            model: this.model,
            response_format:{
                'type': 'json_object'
            }
        })

        return JSON.parse(response.choices[0].message.content || '' )

    }catch(error: any){
        throw new Error("Fatal error: deepseek model returned error " + JSON.stringify(error.error))
    }
    
    }
}