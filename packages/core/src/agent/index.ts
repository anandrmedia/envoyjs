import { Tool } from "../tools";
import { Model } from "../model";
import {
  AnyModelConfig,
  ModelConfig,
  ModelExtendedContent,
  ModelMessage,
} from "../model/types";
import { getMasterPrompt } from "./lib/master-prompt";
import { AgentMessage, AgentResponse } from "./types";
import ora from "ora";
import { StructuredResponse } from "./structured-response";
import { writeFile, appendFile } from "fs/promises";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class Agent {
  public name: string = "default_agent";
  public bio: string;
  public steps: string[] = [];
  public modelConfig!: AnyModelConfig;
  public tools: Tool[] = [];
  public _debugMode?: boolean = false;
  public responseStructure?: StructuredResponse;
  public showToolUsage: boolean = false;

  private responseMessages: Array<AgentMessage> = [];

  private model!: Model;
  private messages: ModelMessage[] = [];

  constructor(config: {
    name: string;
    bio: string;
    steps: string[];
    modelConfig: AnyModelConfig;
    tools?: Tool[];
    _debugMode?: boolean;
    responseStructure?: StructuredResponse;
    showToolUsage?: boolean;
  }) {
    this.name = config.name;
    this.bio = config.bio;
    this.steps = config.steps;
    this.modelConfig = config.modelConfig;
    this._debugMode = config._debugMode;
    this.responseStructure = config.responseStructure;

    if (config.tools) {
      this.tools = config.tools;
    }

    if (config.showToolUsage) {
      this.showToolUsage = config.showToolUsage;
    }

    // Initialise the model
    this.model = new Model({ modelConfig: this.modelConfig });
    this.model.initializeModel();

    //console.log("tools are", this.tools)
    this.initialiseAgent();
  }

  private initialiseAgent() {
    this.messages.push({
      role: "system",
      content: this.preparePrompt(),
    });
  }

  private preparePrompt() {
    //console.log("Initializing prompt with tools ",this.tools)
    const prompt = getMasterPrompt({
      name: this.name,
      bio: this.bio,
      tools: this.tools,
      steps: this.steps,
      responseStructure: this.responseStructure,
    });

    //console.log("Prepared master prompt is ", prompt);

    return prompt;
  }

  private addMessage(content: string, imageBase64?: string) {
    const contentArray: ModelExtendedContent[] = [
      {
        type: "text",
        text: content,
      },
    ];

    if (imageBase64) {
      contentArray.push({
        type: "image_url",
        image_url: {
          url: imageBase64,
        },
      });
    }

    this.messages.push({
      role: "user",
      content: contentArray,
    });
  }

  private async prompt(prompt: string, imageBase64?: string) {
    if (this._debugMode) {
      await appendFile("agentOut.txt", " awaiting llm response\n");
    }

    if (imageBase64) {
      this.addMessage(prompt, imageBase64);
    } else {
      this.addMessage(prompt);
    }

    //console.log("messages array is", this.messages);

    const response = await this.model.sendAndReceiveResponse(this.messages);

    if (this._debugMode) {
      await appendFile("agentOut.txt", " llm responded\n");
    }

    this.addMessage(JSON.stringify(response));

    //console.log("Response is ", response);

    return response;
  }

  private async newProcess(response: AgentResponse) {
    if (
      response.use_tool &&
      (response.use_tool != undefined ||
        typeof response.use_tool != "undefined")
    ) {
      this.showToolUsage &&
        console.log(
          "\n 🛠️ Using tool " +
            response.use_tool.identifier +
            " with function ",
          response.use_tool.function_name + " and args ",
          response.use_tool.args + "\n"
        );

      const tool = this.getTool(response.use_tool.identifier);

      if (!tool) {
        console.error(
          "Fatal error: Couldn't find a tool with identifier ",
          response.use_tool.identifier
        );
        process.exit(0);
      }

      const fn = response.use_tool.function_name;
      const args = response.use_tool.args;

      let functionResponse;
      try {
        functionResponse = await tool.functionMap[fn](...args);

        if (functionResponse.isImage) {
          return {
            taskCompleted: response.task_completed,
            nextPrompt: "Here is the image",
            image: functionResponse.image,
          };
        }

        return {
          taskCompleted: response.task_completed,
          nextPrompt: "<tool_response>" + functionResponse + "</tool_response>",
        };
      } catch (error) {
        functionResponse = "Oops! Function call returned error " + error;
        return {
          taskCompleted: response.task_completed,
          nextPrompt: "<tool_response>" + functionResponse + "</tool_response>",
        };
      }
    } else if (response.task_completed == false) {
      return {
        taskCompleted: false,
        nextPrompt: "Continue",
      };
    }

    return {
      taskCompleted: true,
      nextPrompt: "",
    };
  }

  private async autoPrompt(initialPrompt: string, initialImageBase64?: string) {
    let prompt = initialPrompt;
    let imageBase64 = initialImageBase64;
    let finalResponse;

    while (true) {
      //console.log("prompt is ", prompt);

      if (this._debugMode) {
        await appendFile("agentOut.txt", "Prompt: " + prompt + "\n");
      }
      const response = await this.prompt(prompt, imageBase64);
      //console.log("Response is ", response);
      if (this._debugMode) {
        await appendFile(
          "agentOut.txt",
          "Response: " + JSON.stringify(response) + "\n"
        );
      }
      const processResponse = await this.newProcess(response);

      if (processResponse?.taskCompleted) {
        finalResponse = response.response;
        break;
      }

      prompt = processResponse?.nextPrompt;

      if (processResponse.image) {
        imageBase64 = processResponse.image;
      } else {
        imageBase64 = undefined;
      }
    }

    return finalResponse;
  }

  private getTool(identifier: string) {
    return this.tools?.find((tool) => tool.identifier === identifier) || false;
  }

  public async run(prompt: string, imageBase64?:string) {
    if (this._debugMode) {
      await writeFile("agentOut.txt", "");
    }
    const finalResponse = await this.autoPrompt(prompt, imageBase64);
    return finalResponse;
  }

  public async printResponse(prompt: string, imageBase64?:string, config?: {}) {
    const spinner = ora().start();
    console.log((await this.run(prompt, imageBase64))?.message);
    spinner.stop();

    if (this._debugMode) {
      console.log("Agent raw message stack written to agentRawMessageStack.txt");
      await writeFile("agentRawMessageStack.txt", JSON.stringify(this.messages.slice(1)));
    }
  }
}
