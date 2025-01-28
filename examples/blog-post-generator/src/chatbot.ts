import { Agent, crawlerTool, fileWriterTool, googleSearchTool, webPageToMarkdownTool } from "@envoyjs/core";
import * as dotenv from 'dotenv';
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

googleSearchTool.init({
    serperApiKey: process.env.SERPER_API_KEY as string
})

dotenv.config();

const agent = new Agent({
    showToolUsage: true,
    _debugMode: true,
    name: "Intelligent agent",
    bio: "You are intelligent agent with lot of smart tools to solve any problems",
    steps:[
        "First - Carefully analyze the task by spelling it out loud.",
        "Then, break down the problem by thinking through it step by step and develop multiple strategies to solve the problem.",
        "Work through your plan step-by-step, executing any tools as needed.",
        "For mathematical problems, you must make use of the tools"
    ],
    modelConfig:{
        provider: "DEEP_SEEK",
        model:"deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY as string
    },
    tools:[fileWriterTool, googleSearchTool, crawlerTool, webPageToMarkdownTool]
})

const messages = []

async function main(){
    while(true){
        const input: string = await new Promise((resolve) => {
            rl.question("Say something: ", resolve)
        })

        await agent.printResponse(input);
    }
}


main()