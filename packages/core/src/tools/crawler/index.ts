import axios from "axios";
import { Tool } from "../base/base-tool";
import puppeteer from "puppeteer"

class CrawlerTool extends Tool{
    public name = "Crawler Tool"
    public identifier: string = "crawler-tool"
    public instructions: string[] = ["Crawl the given URL and return the HTML response", "If the LLM Model has token limit, it's safe to pass a limit using the maxChars argument"]
    public abilities: string[] = ["Can crawl a given URL and return the HTML body of that page", "Can read the content of any web page"]
    public functions = [
        {
            name: "crawl",
            purpose: "crawl a given url and gets its raw HTML body",
            arguments:[{
                name: "url",
                description: "URL of the page to be crawled",
                dataType: "string"
            },{
                name: "maxChars",
                description: "Maximum characters to be returned in response. Use this if the LLM model has token limits",
                dataType: "number"
            }],
            response: "HTML body of the crawled page. If it has only Javascript, then it indicates that it's an SPA and this tool may not work"
        }
    ]

    public functionMap = {
        'crawl': this.crawl.bind(this)
    }

    async crawl(url: string, maxChars: number = 10000){

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('body');
        const response = await page.evaluate(() => {
            return document.querySelector('body')?.innerHTML;
        });
        if(maxChars){
            return response?.substring(0, maxChars)
        }
        
        return response;
    }
}

export const crawlerTool =  new CrawlerTool();