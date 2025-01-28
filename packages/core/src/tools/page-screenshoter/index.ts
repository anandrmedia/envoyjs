import { ToolFunctionSpec } from "../base/types";
import { Tool } from "../base/base-tool";
import puppeteer, { Page } from "puppeteer";
import {readFile} from "fs/promises"
import { extname } from 'path';


class PageScreenshotTool extends Tool{

    name: string = "Page screenshot tool"
    identifier: string = "page_screenshot_tool"
    abilities: string[] = [
        "Can take the screenshot of any page by visiting it's URL"
    ]
    instructions: string[] = [
        "Take the screenshot of the given page by calling the screenshot function"
    ]

    functions: ToolFunctionSpec[] = [
        {
            name: "screenshot",
            purpose: "Take the screenshot of given page and save it in the path provided",
            arguments: [
                {
                    name: "url",
                    dataType: "string",
                    description: "Url of the page to be screenshotted",
                },
                {
                    name: "path",
                    dataType: "string",
                    description: "Path to save the screenshot",
                }
            ],
            response: "Screenshotted image"
        }
    ]

    functionMap: { [key: string]: any; } = {
        'screenshot': this.screenshot.bind(this)
    }


    async screenshot (url: string, path:string){
        const browser = await puppeteer.launch({
            headless: false
          });

          const page = await browser.newPage();

          // go to the target web page
          await page.goto(url);
        
          // take page screenshot
          await page.screenshot({
            type: "png", // can also be "jpeg" or "webp" (recommended)
            path, // save image data to a PNG file
          });
        
          browser.close();

          return {
            isImage: true,
            image: await this.getFileBase64Url(path)
          }
    }

    async getFileBase64Url(filePath: string): Promise<string> {
        try {
            // Read the file
            const buffer = await readFile(filePath);
            
            // Convert buffer to base64
            const base64String = buffer.toString('base64');
            
            // Determine mime type based on file extension
            const extension = extname(filePath).toLowerCase();
            const mimeType = this.getMimeType(extension);
            
            // Create and return the complete data URL
            return `data:${mimeType};base64,${base64String}`;
        } catch (error) {
            console.error('Error converting file to base64:', error);
            throw error;
        }
    }
    
    /**
     * Get mime type based on file extension
     * @param extension - File extension including the dot
     * @returns string - Returns corresponding mime type
     */
    getMimeType(extension: string): string {
        const mimeTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            // Add more mime types as needed
        };
    
        return mimeTypes[extension] || 'application/octet-stream';
    }
    

}

export const pageScreenshotTool = new PageScreenshotTool()