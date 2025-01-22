import {Agent, youtubeTranscriptTool} from "@envoyjs/core";
import { fileWriterTool } from "./tools/file-writer";


const agent = new Agent({
    name: "Content Summariser Agent",
    bio: "You are expert in reading youtube video transcripts and summarising what the video is about",
    steps: ["Read the transcript", "Understand the entire context", "Find relevant portions", "Summarise as text", "Save it as a file"],
    modelConfig:{
        provider: "OPEN_AI",
        apiKey: "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",
        model: "gpt-4o"
    },
    tools: [youtubeTranscriptTool, fileWriterTool]
});

agent.printResponse("Summarise this youtube video - https://youtu.be/QtYEPYntfL4 and save it in transcripts folder");