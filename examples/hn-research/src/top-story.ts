import { Agent, crawlerTool } from "@envoyjs/core";
import { hackerNewsApiTool } from "./hacker-news-api-tool";

const agent = new Agent({
  name: "Hacker News Post Maker",
  bio: "You are an expert in crafting high quality hackernews posts by analysing the past viral posts on Hackernews",
  steps: [
    "Find the id of top performing 50 hackernews posts",
    "Get the details of each post (such as title, score)",
    "Learn their writing pattern such as title, description etc",
    "craft a compelling hackernews title and description based on the instruction given based on your analysis",
    "Use similar style as you saw in other hackernews posts with high scores",
    "write in simple, direct english. No jargons or salesy words"
  ],
  modelConfig: {
    provider: "OPEN_AI",
    apiKey: "",
    model: "gpt-4o",
  },
  tools: [hackerNewsApiTool, crawlerTool],
});

agent.printResponse(
  "Suggest a title and message for a Github repo I'm going to share in Hackernews - https://github.com/anandrmedia/envoyjs. It's a simple Javascript agentic framework. Agentic frameworks are new to JS and they are very rare. So I think this might go viral"
);
