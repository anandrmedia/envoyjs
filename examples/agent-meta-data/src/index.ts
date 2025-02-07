import {Agent, youtubeTranscriptTool} from "@envoyjs/core";
import { expenseTracker } from "./tools/expense-tracker";
import * as dotenv from "dotenv"
dotenv.config()

const agent = new Agent({
    name: "Expense tracker agent",
    bio: "You are a personal expense tracker",
    steps: ["Understand the input", "Identify the expense amount and name for the transaction", "Track the expense using given tool"],
    modelConfig:{
        provider: "OPEN_AI",
        apiKey: process.env.OPEN_AI_API_KEY as string,
        model: "gpt-4o"
    },
    tools: [expenseTracker],
    metaData: {
        email: "anand@example.com"
    },
    _debugMode: true,
});

agent.printResponse("Track Rs.500 towards fuel");