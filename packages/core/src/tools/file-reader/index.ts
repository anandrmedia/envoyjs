import { ToolFunctionSpec } from "../base/types";
import { Tool } from "../base/base-tool";
import { readFile } from 'fs/promises';


class FileReaderTool extends Tool{
    name="file reader tool"
    identifier = "file-reader-tool"
    abilities = ["You can read a given file from disk"]
    instructions = ["Read using read function"]

    functions: ToolFunctionSpec[] = [{
        name: "read",
        purpose: "Read a file from disk",
        arguments: [{
            name: "filePath",
            description: "Path of the file to read",
            dataType: "string"
        }],
        response: "Content of the file in string format"
    }];

    functionMap = { 
        'read': this.read.bind(this)
    };

    async read(filePath: string): Promise<string> {
        try {
          const data = await readFile(filePath, 'utf-8');
          return data;
        } catch (err) {
          return 'Error reading file: '+err;
        }
      }
} 

export const fileReaderTool = new FileReaderTool()