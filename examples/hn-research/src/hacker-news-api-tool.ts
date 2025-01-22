import { Tool, ToolFunctionSpec } from "@envoyjs/core";
import axios from "axios";

export class HackerNewsApiTool extends Tool {
  public name = "Hacker News API Tool";
  public identifier = "hacker-news-api-tool";
  public abilities: string[] = [
    "You can find the list of best post IDs in Hackernews, Get post details (such as score) by it's id",
  ];
  public instructions = [
    "Use findBestPosts function to find the best posts",
    "Use findPostById function to get details about a post",
    "a post with high score indicates the quality of that post",
    "analyse the writing style of posts with high score",
  ];

  functions: ToolFunctionSpec[] = [
    {
      name: "findBestPosts",
      arguments: [],
      purpose:
        "To get the ids of best performing posts in Hackernews. But post details not included",
      response:
        "Returns list of IDs of best performing posts in Hackernews as JSON array. Use findPostById function to find details about a post by it's ID",
    },
    {
      name: "findPostById",
      arguments: [
        {
          name: "id",
          description: "id of the post",
          dataType: "number",
        },
      ],
      purpose: "To get the details of a post if its ID is given",
      response:
        "Returns details of the post such as it's score, timestamp etc as a JSON object",
    },
  ];

  functionMap = {
    findBestPosts: this.findBestPosts.bind(this),
    findPostById: this.findPostById.bind(this),
  };

  async findBestPosts() {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
    );
    return JSON.stringify(response.data);
  }

  async findPostById(id: number) {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty"
    );
    return JSON.stringify(response.data);
  }
}

export const hackerNewsApiTool = new HackerNewsApiTool();
