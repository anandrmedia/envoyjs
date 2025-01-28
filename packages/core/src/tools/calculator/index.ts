import { ToolFunctionSpec } from "../base/types";
import { Tool } from "../base/base-tool";

export class CalculatorTool extends Tool{

    name = "Calculator Tool"
    identifier = "calculator_tool"
    abilities = ["Evaluate mathematical expressions"]
    instructions: string[] = ["Use the evaluate function to perform the mathematical expression evaluation and get the result"]
    functions: ToolFunctionSpec[] = [{
        name: "evaluate",
        purpose: "To evaluate a mathematical expression in Javascript",
        arguments: [{
            name: "expression",
            description: "Javascript mathematical expression, for example: 784*566",
            dataType: "string"
        }],
        response: "result of expression evaluation"
    }]

    functionMap = {
        "evaluate": this.evaluate.bind(this)
    }

    async evaluate(expression: string){
        console.log("exp ",expression, eval(expression))
        return eval(expression);
    }

}

export const calculatorTool = new CalculatorTool()