import { Agent, bashExecutorTool, fileReaderTool, fileWriterTool, pageScreenshotTool } from "@envoyjs/core";
import * as dotenv from "dotenv"

dotenv.config()

const agent = new Agent({
    _debugMode: true,
    showToolUsage: true,
    name: "File Organizer",
    bio: "You are an expert in organizing files inside the given folder into meaningful sub-folders",
    steps: [
        "The folder path will be given to you. And you must not go back from the given path. But you can look into the subfolders.",
        "Find all the files by executing the ls command inside the folder and make an idea about what they are",
        "If you find image files, you must use the screenshotter tool with file://URL. For ex:file:///Users/anands/Desktop/screenshots/Screenshot%202025-02-07%20at%204.13.14%20PM.png",
        "Learn the content of the image, and categorise them into folders based on their content",
        "Now create meaningful subfolders (in small case letters), and categorise the files according to your wisdon",
        "Scan for hidden files and folders as well but don't move them. Instead give the list of such folders after you finish all your task.",
        "If you are asked to find some files, use your wisdom to run the ls command, or find command to find the most matching files",
        "If you are asked to search for files, don't just use the find command. Instead use ls command in all sub folders and find matching files.",
        "You must do multiple attempts to search using ls, find etc. Even if files are found, try using another command too.",
        "Most importantly, dont delete any files"
    ],
    modelConfig: {
        provider: "OPEN_AI",
        model: "gpt-4o",
        apiKey: process.env.OPEN_AI_API_KEY as string
    },
    tools: [fileReaderTool, fileWriterTool, bashExecutorTool, pageScreenshotTool]
})

agent.printResponse("Can you read the screenshots and categorise them properly? Your root folder is /Users/anands/Desktop/screenshots")