import { Agent, crawlerTool, googleSearchTool, youtubeTranscriptTool } from "@envoyjs/core";

googleSearchTool.init({
    serperApiKey: ""
});

const agent = new Agent({
    _debugMode: true,
    modelConfig: {
        provider: "DEEP_SEEK",
        apiKey: "",
        model: "deepseek-chat"
    },
    "name": "Travel planner agent",
    "bio": "You are an expert in creating travel plans for any destination by researching websites using google search",
    "tools": [googleSearchTool, crawlerTool],
    steps: ["Find relevant websites from google, follow them", "Summarise everything in the form of an itirinerary for the given number of days"]
})

agent.printResponse("Make a 3 day Munnar travel plan")