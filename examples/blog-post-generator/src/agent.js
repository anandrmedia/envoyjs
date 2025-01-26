"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@envoyjs/core");
core_1.googleSearchTool.init({
    serperApiKey: process.env.SERPER_API_KEY
});
const newsArticle = new core_1.StructuredResponse({
    title: "Title of the article",
    url: "Link to the article.",
    summary: "Summary of the article if available"
});
const searchResult = new core_1.StructuredResponse({
    articles: [newsArticle]
});
const blogArticle = new core_1.StructuredResponse({
    title: "Title of the blog article",
    summary: "Two sentence summary of the article",
    content: "Content in markdown format"
});
const searcher = new core_1.Agent({
    //  _debugMode: true,
    name: "Searcher agent",
    bio: "You are an expert in performing web search to find relevant results",
    steps: ["Given a topic, search for 20 articles and return the top 5 relevant article."],
    modelConfig: {
        model: "deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY,
        provider: "DEEP_SEEK"
    },
    tools: [core_1.googleSearchTool],
    responseStructure: searchResult
});
const writer = new core_1.Agent({
    _debugMode: true,
    name: "Blog Writer",
    bio: "You are an expert in writing blogs",
    steps: ["You will be provided with a topic and a list of top articles on that topic.",
        "Carefully read each article and generate a New York Times worthy blog post on that topic.",
        "Break the blog post into sections and provide key takeaways at the end.",
        "Make sure the title is catchy and engaging.",
        "Always provide sources, do not make up information or sources.",
        "write the news article to file"],
    modelConfig: {
        model: "deepseek-chat",
        apiKey: process.env.DEEP_SEEK_API_KEY,
        provider: "DEEP_SEEK"
    },
    tools: [core_1.fileWriterTool, core_1.crawlerTool]
});
//searcher.printResponse("How AI agents will change the way we use software");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield searcher.run("US election 2024");
        const blogOut = yield writer.run(`{"topic":"US election 2024", articles:[${JSON.stringify(results)}]}`);
        console.log("output is", blogOut);
    });
}
main();
