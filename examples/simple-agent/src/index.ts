import {Agent, youtubeTranscriptTool} from "@envoyjs/core";
import { fileWriterTool } from "./tools/file-writer";


const agent = new Agent({
    name: "Content Summariser Agent",
    bio: "You are expert in reading youtube video transcripts and summarising what the video is about",
    steps: ["Read the transcript", "Understand the entire context", "Find relevant portions", "Summarise as text", "Save it as a file"],
    modelConfig:{
        provider: "DEEP_SEEK",
        apiKey: "",
        model: "deepseek-chat"
    },
    tools: [youtubeTranscriptTool, fileWriterTool]
});

agent.printResponse("Summarise this youtube video - https://youtu.be/QtYEPYntfL4 and save it in transcripts folder");