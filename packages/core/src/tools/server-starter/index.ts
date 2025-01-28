import { exec, spawn } from "child_process";
import { appendFile, readFile,writeFile } from "fs/promises";
import { ToolFunctionSpec } from "../base/types";
import { Tool } from "../base/base-tool";

class ServerStarterTool extends Tool {
  name = "server executor tool";
  identifier = "server-starter-tool";
  abilities = ["Can start a node server on the folder you specifies"];
  instructions = ["Start the server using start function", "read the output from started server using readServerOutput function"];

  functions: ToolFunctionSpec[] = [
    {
      name: "start",
      purpose: "Runs npm run start on the folder you specifies as the argument",
      arguments: [
        {
          name: "folder",
          description: "Folder where npm run start should be executed",
          dataType: "string",
        },
      ],
      response: "Optimistically starts the server, but you must use the readServerOutput function to know the output",
    },
    {
      name: "readServerOutput",
      purpose: "To read the output from a started server",
      arguments: [
      ],
      response: "Returns the commandline output from server (such as success messages or errors or live logs)",
    },
  ];

  functionMap = {
    start: this.start.bind(this),
    readServerOutput: this.readServerOutput.bind(this)
  };

  async start(folder: string): Promise<string> {
    try {
      const childProcess = exec("npm run start", { cwd: folder });

      childProcess?.stdout?.on("data", async (data) => {
        // console.log(`stdout: ${data}`);
        await appendFile("serverout.txt", data);
      });

      childProcess?.stderr?.on("data", async (data) => {
        //console.error(`stderr: ${data}`);
        await appendFile("serverout.txt", data);
      });

      // Wait a short time for the server to start
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return "Server might have been started. But use the readServerOutput function to know what happened";
    } catch (error) {
      return "Couldn't start server Error:" + error;
    }
  }

  async readServerOutput() {
    try {
      const data = await readFile("serverout.txt", "utf8");
      await writeFile("serverout.txt", "");
      return data;
    } catch (err) {
      return "Error reading file:" + err;
    }
  }
}

export const serverStarterTool = new ServerStarterTool();
