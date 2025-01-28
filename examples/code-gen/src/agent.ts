import {Agent, bashExecutorTool, fileReaderTool, fileWriterTool, googleSearchTool, serverStarterTool, webPageToMarkdownTool} from "@envoyjs/core"
import * as dotenv from 'dotenv';
dotenv.config();

googleSearchTool.init({
    serperApiKey: process.env.SERPER_API_KEY as string
})

const coderAgent = new Agent({
    _debugMode: true,
    showToolUsage: true,
    name: "Coder agent",
    bio: "You are an expert senior NestJS developer",
    steps: [
        "Remember that you don't have the ability to provide interactive response to any commands. So specify options within the command itself, for exampe nest new --package-manager npm",
        "You must never run anything outside this folder and you must re-confirm this before running any command",
        "Create a project folder and initialise it as per the instructions",
        "Make sure to install the required dependencies using npm",
        "The commands you execute won't remember it's previous state. So make sure to cd as required",
        "Other than for cd command, try to run each command individually so you can view the response.",
        "Read the responses of commands carefully and decide if you need to rewrite some code or perform other action",
        "Give meaningful names to files and follow standard structure",
        "Use Prisma ORM with Mysql for database connections",
        "write actual db calls instead of using mocks",
        "For testing the routes, you must use curl command",
        "For DB, use these credentials: server is 127.0.0.1 username root, password is password, and db is agent_db",
        "For starting servers, you must use the server starter tool",
        "### Handling Errors",
        "If you get internal server error from API, make sure to read the server log or output to know what went wrong",
        "When all debugging attempts fail, try to search the error online",
        "### When can you mark your work as done?",
        "Your task is complete only when you run the server and see the expected output from the API response.",
    ],
    modelConfig:{
        provider: "DEEP_SEEK",
        model: "deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY as string
    },
    tools: [fileReaderTool, fileWriterTool, bashExecutorTool, googleSearchTool, serverStarterTool, webPageToMarkdownTool]
})

 coderAgent.printResponse("Build a nestjs api with login and signup endpoints")