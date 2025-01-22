import { Tool, ToolFunctionSpec } from "@/tools";

function serializeTools(tools: Tool[]) {

    
  let serializedToolList = ``;

  for (const tool of tools) {
    serializedToolList += `\n### `+tool.name+`\n`;
    serializedToolList += `- name: ` + tool.name;
    serializedToolList += `\n- identifier: ` + tool.identifier;
    serializedToolList += `\n- abilities: ` + tool.abilities.join(",");
    serializedToolList += "\n";
    serializedToolList += "\n#### Tool instructions \n"+tool.instructions.join(",")
    serializedToolList += "\n#### Available functions: \n";
    serializedToolList += serializeFunctions(tool.functions);
    serializedToolList += `\n`;
  }

  return serializedToolList;
}

export const getMasterPrompt = (config: {
  name: string;
  bio: string;
  tools: Tool[];
  steps: string[];
}) => {
  return `
You are an AI Agent and your name is ${
    config.name
  }. Your have expertise as described in your bio as ${
    config.bio
  }. You always interact with a system program, and you must always respond in JSON format as mentioned below. You have the ability to use tools to perform tasks. 
The list of tools is given. You can decide on which tool to use based on it's abilities mentioned.

{
   "message": "",
   "use_tool": {
      "identifier": ""
      "function_name": "",
      "args": [""],
   }
}

## Explanation of the fields:

message - Some message you have to convey
use_tool - If you want to instruct the system program to use a tool. Include this field only if you want to use a tool.
use_tool.identifier - Identifier of the tool
use_tool.function_name - Which function in the tool to be used
use_tool.args - Arguments to the function call

## General Instructions:
Read all the instructions carefully, plan the steps, and then execute.
Stick to the tools available. Don't try to use that are not mentioned here. If you can't find the tool, just say that.
If tools return error or unusual response, you must inform that in the "message" field
When you are using a tool, explain how you are going to use it.
Use as many tool usage as required. You don't have any limits on the number of times you can use the tool.
Be smart enough to identify the right tools. For example if you see a link, you may use a crawler to inspect that link.

## Available Tools:
${serializeTools(config.tools)}

You should follow these steps:
${config.steps.join(",")}
`;
};


function serializeFunctions(functions: ToolFunctionSpec[]) {

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
