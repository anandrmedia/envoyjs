import axios from "axios";
import { Tool } from "../base/base-tool";

class GoogleSearchTool extends Tool{

    public serperApiKey!:string;

    public name = "Google Search Tool"
    public identifier: string = "google-search-tool"
    public abilities: string[] = ["You can perform google search and get results"]
    public functions = [{
        name: "search",
        purpose: "To do google search and get the results in JSON format",
        arguments: [{
            name: "query",
            description: "The query to be searched",
            dataType: "string"
        },{
            name: "dateRange",
            description: "To return search results within the given date range. Values can be week, month, year",
            dataType: "string"
        }],
        response: "The search results in JSON format or some error message",
    }]

    public instructions: string[] = ["Use the search function to perform google search"]

    public functionMap = {
        'search': this.search.bind(this)
    }

    public init(config:{
        serperApiKey: string
    }){
        this.serperApiKey = config.serperApiKey
    }

    async search(query: string, dateRange: string){

        const dateMap: {[key:string]: string} = {
            week: "qdr:w",
            month: "qdr:m",
            year: "qdr:y",
        }

        if(!this.serperApiKey){
            return 'Cannot do search, because search tool was not initialised with a serper api key!'
        }

        let dRQuery = "";
        if(dateRange){
            "&tbs="+dateMap[dateRange] || ''
        }

        const response = await axios.get("https://google.serper.dev/search?q="+query+dateRange, {
            headers:{
                'X-API-KEY': this.serperApiKey, 
                'Content-Type': 'application/json'
            }
        });

        return JSON.stringify(response.data);
    }
}

export const googleSearchTool = new GoogleSearchTool()