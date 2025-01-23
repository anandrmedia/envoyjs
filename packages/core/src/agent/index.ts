import { Tool } from "../tools";
import { Model } from "../model";
import { AnyModelConfig, ModelConfig, ModelMessage } from "../model/types";
import { getMasterPrompt } from "./lib/master-prompt";
import { AgentResponse } from "./types";
import ora from "ora";

export class Agent {
  public name: string = "default_agent";
  public bio: string;
  public steps!: string[];
  public modelConfig!: AnyModelConfig
  public tools!: Tool[];
  public _debugMode?: boolean = false;

  private model!: Model;
  private messages: ModelMessage[] = [];

  constructor(config: {
    name: string;
    bio: string;
    steps: string[];
    modelConfig: AnyModelConfig;
    tools?: Tool[];
    _debugMode?: boolean
  }) {
    this.name = config.name;
    this.bio = config.bio;
    this.steps = config.steps;
    this.modelConfig = config.modelConfig;
    this._debugMode = config._debugMode;

    if (config.tools) {
      this.tools = config.tools;
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
    });

    //console.log("Prepared master prompt is ", prompt);

    return prompt;
  }

  private addMessage(content: string) {
    this.messages.push({
      role: "user",
      content,
    });
  }

  private async prompt(prompt: string) {
    this.addMessage(prompt);

    //console.log("messages array is", this.messages);

    const response = await this.model.sendAndReceiveResponse(this.messages);

    this.addMessage(JSON.stringify(response));

    //console.log("Response is ", response);

    return response;
  }

  private async process(response: AgentResponse) {

    if(response.message){
        console.log(" 🤖 ",response.message)
    }

    if (response.use_tool) {
        console.log("\n 🛠️ Using tool "+response.use_tool.identifier+"\n");
      
     const tool = this.getTool(response.use_tool.identifier);

      if(!tool){
        console.error("Fatal error: Couldn't find a tool with identifier ",response.use_tool.identifier);
        process.exit(0);
      }

      const fn = response.use_tool.function_name;
      const args = response.use_tool.args;

      const functionResponse = await tool.functionMap[fn](...args);
      try{
        await this.process(await this.prompt("Function response is "+functionResponse+"\n Continue as per your original plan"))
      }catch(error){
        console.error("Fatal error ", error)
      }
    }

  }

  private getTool(identifier: string) {
    return this.tools.find((tool) => tool.identifier === identifier) || false
  }

  public async printResponse(prompt: string, config?: {}) {
    const spinner = ora().start()
    await this.process(await this.prompt(prompt)); 
    spinner.stop();


    if(this._debugMode){
        console.log("--MESSAGE STACK--")
        console.log(this.messages);
    }
  }
}
