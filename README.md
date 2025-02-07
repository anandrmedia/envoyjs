<p align="center">
 <img src="https://github.com/anandrmedia/envoyjs/raw/main/docs/resources/images/logo.png" width="350" />
</p>

## EnvoyJS - Easiest way to build agents in Typescript

[![](https://img.shields.io/npm/v/@envoyjs/core)](https://www.npmjs.com/package/@envoyjs/core)

![](https://github.com/anandrmedia/envoyjs/blob/main/docs/resources/images/envoyjs.gif?raw=true)

```
⚠️ Warning
EnvoyJS is in its early stages and is primarily developed for personal use.
While it provides basic functionality for creating agents and tools, it may contain unknown bugs or unexpected behavior. Please use it cautiously, as it can potentially exhaust your valuable tokens or incur unexpected costs.
```

## Introduction

EnvoyJS is a simple JavaScript framework for building agentic applications. With EnvoyJS, you can create agents with customizable behavior and functionality. The framework supports OpenAI models and allows the creation of custom tools that can be used by agents to perform various tasks.

## Getting Started
### Installation
Install the EnvoyJS framework using npm or yarn:

```bash
npm install @envoyjs/core
```

## Agents
Agents are the core component of EnvoyJS. They define the behavior, purpose, and tools required to execute tasks.

### Parameters for Agent
- `name`: The name of the agent.
- `bio`: A short description of the agent's purpose.
- `steps`: Step-by-step instructions for the agent to follow as array of strings.
- `modelConfig`: Configuration for the AI model, including provider, API key, and model type.
- `tools`: List of tools the agent can use (e.g., custom tools like FileWriterTool).
- `responseStructure`: The structure for the model to respond (Should be an object of `StructuredResponse` class)

### Supported Models

Currently, `OPEN_AI` and `DEEP_SEEK` are supported.

### Example: Creating and running an Agent
Here is an example of creating a Content Summariser Agent:

```javascript
import { Agent, youtubeTranscriptTool } from "@envoyjs/core";
import { fileWriterTool } from "./custom-tools/file-writer";

const agent = new Agent({
    name: "Content Summariser Agent",
    bio: "You are an expert in reading YouTube video transcripts and summarizing what the video is about.",
    steps: [
        "Read the transcript",
        "Understand the entire context",
        "Find relevant portions",
        "Summarize as text",
        "Save it as a file"
    ],
    modelConfig: {
        provider: "OPEN_AI",
        apiKey: "", // Add your OpenAI API key
        model: "gpt-4o"
    },
    tools: [youtubeTranscriptTool, fileWriterTool] // Add tools here
});

agent.printResponse("Summarise this youtube video - https://youtu.be/QtYEPYntfL4?si=KXJemWrsx_pmyU3W");
```
