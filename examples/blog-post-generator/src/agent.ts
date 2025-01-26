import * as dotenv from 'dotenv';
dotenv.config();

import { Agent, crawlerTool, fileWriterTool, googleSearchTool, StructuredResponse, webPageToMarkdownTool } from '@envoyjs/core';

googleSearchTool.init({
    serperApiKey: process.env.SERPER_API_KEY as string
})

const newsArticle = new StructuredResponse({
    title: "Title of the article",
    url: "Link to the article.",
    summary: "Summary of the article if available"
});

const searchResult = new StructuredResponse({
    articles: [newsArticle]
})

const blogArticle = new StructuredResponse({
    title: "Title of the blog article",
    summary: "Two sentence summary of the article",
    content: "Content in markdown format"
})


const searcher = new Agent({
    //  _debugMode: true,
    name: "Searcher agent",
    bio: "You are an expert in performing web search to find relevant results",
    steps: ["Given a topic, search for 20 articles and return the top 5 relevant article."],
    modelConfig:{
        model: "deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY as string,
        provider: "DEEP_SEEK"
    },
    tools: [googleSearchTool],
    responseStructure:searchResult,
    showToolUsage: true
});

const writer = new Agent({
    //   _debugMode: true,
    name: "Blog Writer",
    bio: "You are an expert in writing blogs",
    steps: ["You will be provided with a topic and a list of top articles on that topic.",
            "Carefully read each article and generate a New York Times worthy blog post on that topic.",
            "Break the blog post into sections and provide key takeaways at the end.",
            "Make sure the title is catchy and engaging.",
            "Always provide sources, do not make up information or sources.",
            "write the news article to file"],
    modelConfig:{
        model: "deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY as string,
        provider: "DEEP_SEEK"
    },
    tools:[fileWriterTool, webPageToMarkdownTool],
    showToolUsage: true
})

//searcher.printResponse("How AI agents will change the way we use software");


async function main(){
    const results = await searcher.run("US election 2024");
    const blogOut = await writer.printResponse(`{"topic":"US election 2024", articles:[${JSON.stringify(results)}]}`);
    console.log("output is", blogOut)
}


main();