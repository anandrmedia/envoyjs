import { Tool, ToolFunctionSpec } from "@envoyjs/core";
import { promises as fs } from 'fs';

class ExpenseTrackerTool extends Tool{

    public identifier = "expense_tracker_tool"
    public name = "Expense Tracker Tool"
    public abilities = ["Can record expenses"]
    public instructions: string[] = ["Use the trackExpense function to track finance"]
    public functions: ToolFunctionSpec[] = [{
        name: 'trackExpense',
        purpose: 'To track/record the given expense',
        arguments: [{
            name: 'name',
            description: 'name of the expense entry',
            dataType: "string"
        },{
            name: 'amount',
            description: 'amount',
            dataType: "number"
        }],
        response: "success or failure with error message"
    },]

    public functionMap = {
        'trackExpense': this.trackExpense.bind(this),
    }

    public async trackExpense(name: string, amount: string){
        const executingAgent = this.executingAgent;
        console.log("Tracking expense for agent ",executingAgent?.metaData.email)
        return 'successfully tracked expense'
    }

}


export const expenseTracker = new ExpenseTrackerTool()