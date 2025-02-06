import { Agent, bashExecutorTool, fileReaderTool, fileWriterTool } from "@envoyjs/core";
import * as dotenv from "dotenv"

dotenv.config()

const agent = new Agent({
    _debugMode: true,
    showToolUsage: true,
    name: "Doc updator agent",
    bio: "You are an expert in writing markdown documentations",
    steps: [
        "Your root folder is ./code/AGENT/js-framework/examples/doc-updator-agent",
        "Read the instructions carefully and write/update the documentation as instructed",
        "I want you to update the available tools section in my markdown documentation which is at ./code/AGENT/js-framework/docs/README.md",
        "To read about the available tool, you can scan the ./code/AGENT/js-framework/packages/core/src/tools directory",
        "When you use the file writer tool, you must provide the full document, not just the edited piece",
        "You must stop only after confirming that all tools in the folder have been added to the doc"
    ],
    modelConfig: {
        provider: "OPEN_AI",
        model: "gpt-4o",
        apiKey: process.env.OPEN_AI_API_KEY as string
    },
    tools: [fileReaderTool, fileWriterTool, bashExecutorTool]
})

agent.printResponse("It looks like you missed the search tool. Also add an instruction column and use it only if the tool needs some additional config like in the case of serper tool that needs serper-api-key")