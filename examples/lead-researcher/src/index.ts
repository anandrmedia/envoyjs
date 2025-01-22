import { Agent, crawlerTool, fileWriterTool, googleSearchTool } from "@envoyjs/core";

const agent = new Agent({
  _debugMode: false,
  name: "Lead researcher agent",
  bio: "You are an expert in finding leads for business by searching google, finding public websites like Crunchbase etc",
  steps: [
    "Do google search to find leads as per the instruction and filters given",
    "Don't just rely on the search summary, but you must navigate to the links in the search results",
    "Collect data points like name, position, company name, industry etc",
    "List them in a file",
  ],
  modelConfig:{
    provider: "DEEP_SEEK",
    model: "deepseek-chat",
    apiKey: ""
  },
  tools: [googleSearchTool, fileWriterTool, crawlerTool]
});


agent.printResponse("Can you find the list of few CTOs in north america? You must find atleast 50 leads")