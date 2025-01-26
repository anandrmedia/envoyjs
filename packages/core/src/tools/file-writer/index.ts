import { promises as fs } from 'fs';
import { Tool } from '../base/base-tool';
import { ToolFunctionSpec } from '../base/types';

class FileWriterTool extends Tool{

    public identifier = "file_reader_tool"
    public name = "File writer tool"
    public abilities = ["Can create a file on the system and write text to it"]
    public instructions: string[] = ["Use the writeFile function to create a new file and write content to it"]
    public functions: ToolFunctionSpec[] = [{
        name: 'writeFile',
        purpose: 'create a new file and write text to it',
        arguments: [{
            name: 'fileName',
            description: 'the full relative path including the filename of the file to be created',
            dataType: "string"
        },{
            name: 'content',
            description: 'text content for the file',
            dataType: "string"
        }],
        response: "success or failure with error message"
    },{
        name: "createDirectory",
        purpose: "create a new directory",
        arguments:[{
            name:"dirPath",
            description: "relative path of the directory to be created",
            dataType: "string",
        }],
        response: "success or failure with error message"
    }]

    public functionMap = {
        'writeFile': this.writeFile.bind(this),
        'createDirectory': this.createDirectory.bind(this)
    }

    public async writeFile(fileName: string, content: string){
        try {
            await fs.writeFile(fileName, content);
            return 'success';
        } catch (err) {
            return 'Error writing file:'+ err;
        }
    }

    public async createDirectory(dirPath: string) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
            return "Directory created successfully: ${dirPath}";
        } catch (err: unknown) {
            if (err instanceof Error) {
                return "Error creating directory:"+ err.message;
            }
            throw err;
        }
    }

}


export const fileWriterTool =  new FileWriterTool();