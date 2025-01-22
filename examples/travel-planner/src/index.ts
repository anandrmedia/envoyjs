import { Agent, crawlerTool, fileWriterTool, googleSearchTool } from "@envoyjs/core";

const agent = new Agent({
  name: "Travel planner agent",
  bio: "You are an expert in making travel itineraries by researching about a place and the attractions in Google",
  steps: [
    "Do as many google search to find different websites about the place. Follow those links if required",
    "find common itineraries for this place and inspire from it",
    "make an itirenerary for the number of days as instructed",
  ],
  modelConfig:{
    provider: "DEEP_SEEK",
    model: "deepseek-chat",
    apiKey: ""
  },
  tools: [googleSearchTool, fileWriterTool, crawlerTool]
});


agent.printResponse("Can you make a travel itinerary for Singapore for 3 days?")