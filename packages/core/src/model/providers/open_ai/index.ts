import OpenAI from "openai";
import { ModelConfig, ModelMessage, OpenAIModel } from "@/model/types";
import { AgentResponse } from "@/agent/types";


export class OpenAIProvider{

    private client!: OpenAI;
    private model!: OpenAIModel

    constructor(config: ModelConfig){
        this.client = new OpenAI({
            apiKey: config.apiKey,
        })

        this.model = config.model
    }

    async sendAndReceiveResponse(messages: ModelMessage[]): Promise<AgentResponse>{
        const response = await this.client.chat.completions.create({
            messages,
            model: this.model,
            response_format:{
                'type': 'json_object'
            }
        })

        return JSON.parse(response.choices[0].message.content || '' )
    
    }
}