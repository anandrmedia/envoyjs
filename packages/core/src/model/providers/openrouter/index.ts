import { AgentResponse } from "../../../agent/types";
import { ModelConfig, ModelMessage, ModelType, OpenRouterModel } from "../../../model/types";
import OpenAI from "openai";

export class OpenRouterProvider{

    private client: OpenAI
    private model: OpenRouterModel


    constructor(config: ModelConfig<typeof ModelType.OpenRouter>){
            this.client = new OpenAI({
                baseURL: "https://openrouter.ai/api/v1",
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
            } as any)

            //console.log("Raw output is", response.choices[0].message.content);
    
            return JSON.parse(response.choices[0].message.content || '' )
        
        }
}