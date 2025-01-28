import { ToolFunctionSpec } from "../base/types";
import { Tool } from "../base/base-tool";
import { exec } from "child_process";
import { appendFile, readFile,writeFile } from "fs/promises";
import { promisify } from 'util';

const execPromise = promisify(exec);

class BashExecutorTool extends Tool {
  name = "bash executor tool";
  identifier = "bash-executor-tool";
  abilities = ["Can execute a command in bash and return the response"];
  instructions = [
    "Execute the bash command using execute function",
  ];

  functions: ToolFunctionSpec[] = [
    {
      name: "execute",
      purpose: "Execute a bash command in terminal",
      arguments: [
        {
          name: "command",
          description: "Command to be executed",
          dataType: "string",
        },
      ],
      response: "The output of executed command",
    }
  ];

  functionMap = {
    execute: this.execute.bind(this)
  };

  async execute(command: string) {

    try {
      // Execute command and wait for completion
      const { stdout, stderr } = await execPromise(command, {timeout: 50000});
      
      // If there's stderr output but the command didn't fail, you might want to include it
      if (stderr) {
        return `${stdout}\nSTDERR: ${stderr}`;
      }

      
      
      return stdout;
    } catch (error: any) {
      // Handle any errors that occurred during execution
      if (error.code === 'ETIMEDOUT') {
       return 'Command timed out. Maybe because it needed an input from you, which is impossible as per your first instruction. Remember - interactive prompts are not supported. You must find alternative ways to run the command or use a different command!';
      }
      return 'Command execution failed: '+ error.message;
    }

  }

 
}

export const bashExecutorTool = new BashExecutorTool();
