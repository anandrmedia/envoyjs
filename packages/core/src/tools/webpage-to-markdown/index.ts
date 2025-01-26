import { Tool } from "../base/base-tool";
import { ToolFunctionSpec } from "../base/types";
import puppeteer from "puppeteer";

class WebPageToMarkdownTool extends Tool{
    name="Web page to markdown converter tool"
    identifier = "webpage-to-markdown"
    abilities = ["Can crawl the given URL and convert the content into a markdown document with relevant pieces of text"]
    instructions = ["use the convertToMarkdown function"]


    functions = [{
        name: "convertToMarkdown",
        purpose: "To crawl the given URL and return a markdown string with relevant tags such as H1, H2 etc",
        arguments:[
            {
                name: "url",
                dataType: "string",
                description: "Url to be crawled"
            },
            {
                name: "maxChars",
                description: "Maximum characters to be returned in response. Use this if the LLM model has token limits",
                dataType: "number"
            }
        ],
        response: "The web page converted to a markdown string"
    }]


    functionMap = {
        'convertToMarkdown': this.convertToMarkdown.bind(this)
    }

    async convertToMarkdown(url: string, maxChars: number = 10000): Promise<string> {

        if(maxChars > 10000){
            maxChars = 10000
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        try {
            // Navigate to the URL
            await page.goto(url, { waitUntil: 'domcontentloaded' });
    
            // Extract relevant content
            const data = await page.evaluate(() => {
                // Create a structure to store headings and their associated content
                const content: { [key: string]: string[] } = {};
    
                // Loop through h1-h5 tags
                ['h1', 'h2', 'h3', 'h4', 'h5', 'p'].forEach((tag) => {
                    const elements = document.querySelectorAll(tag);
    
                    elements.forEach((element) => {
                        const textContent = element.textContent?.trim() || '';
    
                        if (textContent) {
                            // Collect <p> and <span> content under the heading
                            const relatedContent: string[] = [];
    
                            // Sibling elements
                            let sibling = element.nextElementSibling;
                            while (sibling && !['H1', 'H2', 'H3', 'H4', 'H5'].includes(sibling.tagName)) {
                                if (sibling.tagName === 'P' || sibling.tagName === 'SPAN') {
                                    relatedContent.push(sibling.textContent?.trim() || '');
                                }
                                sibling = sibling.nextElementSibling;
                            }
    
                            // Add heading and its content
                            content[textContent] = relatedContent;
                        }
                    });
                });
    
                return content;
            });
    
            // Convert the extracted data into markdown format
            let markdown = `# Extracted Content from ${url}\n\n`;
    
            for (const [heading, relatedContent] of Object.entries(data)) {
                markdown += `## ${heading}\n`;
                relatedContent.forEach((content) => {
                    markdown += `- ${content}\n`;
                });
                markdown += '\n';
            }
    
            return markdown.substring(0,maxChars);
        } catch (error) {
            console.error('Error crawling the page:', error);
            return `Error: Unable to extract content from ${url}`;
        } finally {
            await browser.close();
        }
    }

}

export const webPageToMarkdownTool = new WebPageToMarkdownTool()