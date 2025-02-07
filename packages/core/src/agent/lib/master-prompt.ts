import { Tool, ToolFunctionSpec } from "@/tools";
import { StructuredResponse } from "../structured-response";


function getCurrentTimeInTimeZone(timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // For AM/PM format
  }).format(new Date());
}

function serializeTools(tools: Tool[] = []) {

    
  let serializedToolList = ``;

  for (const tool of tools) {
    serializedToolList += "\n<tool>";
    serializedToolList += `\n### `+tool.name+`\n`;
    serializedToolList += `- name: ` + tool.name;
    serializedToolList += `\n- identifier: ` + tool.identifier;
    serializedToolList += `\n- abilities: ` + tool.abilities.join(",");
    serializedToolList += "\n";
    serializedToolList += "\n#### Tool instructions \n"+tool.instructions.join(",")
    serializedToolList += "\n#### Available functions: \n";
    serializedToolList += serializeFunctions(tool.functions);
    serializedToolList += `\n`;
    serializedToolList += "</tool>\n";
  }

  return serializedToolList;
}

export const getMasterPrompt = (config: {
  name: string;
  bio: string;
  tools: Tool[];
  steps: string[];
  responseStructure?: StructuredResponse
}) => {
  return `
You are an AI Agent that solves a problem by thinking through it step-by-step. Your name is ${
    config.name
  }. Your have expertise as described in your bio as ${
    config.bio
  }. 
  
  First - Carefully analyze the task by spelling it out loud.
  Then, break down the problem by thinking through it step by step and list the steps you will take to solve the problem using the given tools. After that, You must execute each step individually and wait for the response.
  <response_format>
  You always interact with a system program, and you must always respond in JSON format as mentioned below. 
  No other text before or after the JSON. Even any explanatory text should be inside the JSON itself.
  At a time, output only one JSON and wait for the response.

{
  "task_completed": "",
   "response": {
      "type": "",
      "message: "",
   },
   "use_tool": {
      "identifier": ""
      "function_name": "",
      "args": [""],
   }
}

## Explanation of the fields:

task_completed - This is a boolean field. Set this to true only if your work has been completed.
response - The response object. 
response.type - For the final task output use ${config.responseStructure ? 'JSON' : 'string'} format. For intermediate messages, use string format.
response.message - For the final task output use ${(config.responseStructure ? config.responseStructure.toJson(): 'plain text')} ' here. For intermediate messages, use string format
use_tool - If you want to instruct the system program to use a tool. Include this field only if you want to use a tool.
use_tool.identifier - Identifier of the tool
use_tool.function_name - Which function in the tool to be used
use_tool.args - Arguments to the function call
</response_format>

<tools>
${config.tools.length>0 ? serializeTools(config.tools) : 'No tools available!'}
</tools>

<instructions>
* Current date and time is ${getCurrentTimeInTimeZone()}.
* While dealing with real world events, Always check the current date and confirm whether the event in the query is in the past, present, or future relative to today’s date before writing about it. Adapt the tone and details accordingly.
* Read all the steps carefully, plan them, and then execute.
* You cannot send a message and wait for confirmation other than for tool function calls.
* You cannot use any other tools other than the ones given.
* Read the abilities of available tools carefully and choose the most efficient ones.
${config.steps.join("\n")}
</instructions>
`;
};


function serializeFunctions(functions: ToolFunctionSpec[] = []) {

  return JSON.stringify(functions);
  
    let serializedFunctionList = ``;
  
    for (const funct of functions) {
        serializedFunctionList += `\n##### `+funct.name+`\n`;
        serializedFunctionList += `- name: ` + funct.name;
        serializedFunctionList += `\n- purpose: ` + funct.purpose;
        serializedFunctionList += `\n- arguments: `+JSON.stringify(funct.arguments);
        serializedFunctionList += `\n- response: `+funct.response;
    }
  
    return serializedFunctionList;
  }

// export const getToolExecutorPrompt = (config: {
//   tool: Tool
// }) => {
//   return `
// You are a Tool with abilities to do tasks by calling functions. Your name is ${
//     config.tool.name
//   }. Your have the following abilities: ${
//     config.tool.abilities
//   }. You always interact with a system program, and you must always respond in JSON format as mentioned below. You have the ability to call function to perform tasks. 
// The list of functions is given. You can decide on which function to call based on their descriptions mentioned and the instructions given.

// {
//     "name": "",
//     "args": [""]
// }

// Explanation of the fields:

// name - Name of the function
// args - Values of arguments to be passed to this function

// Available Functions:
// ${serializeFunctions(config.tool.functions)}

// Your instructions are:
// ${config.tool.instructions.join(",")}
// `;
// };
