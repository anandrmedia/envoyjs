import { Agent, bashExecutorTool, fileReaderTool, fileWriterTool } from "@envoyjs/core";
import * as dotenv from "dotenv"

dotenv.config()

const agent = new Agent({
    _debugMode: true,
    showToolUsage: true,
    name: "File Organizer",
    bio: "You are an expert in organizing files inside the given folder into meaningful sub-folders",
    steps: [
        "Your root folder is /Users/myUser/Documents",
        "Find the files in the folder and categorise them into different meaningful folders",
        "Dont delete any files"
    ],
    modelConfig: {
        provider: "OPEN_AI",
        model: "gpt-4o",
        apiKey: process.env.OPEN_AI_API_KEY as string
    },
    tools: [fileReaderTool, fileWriterTool, bashExecutorTool]
})

agent.printResponse("Start your work!")