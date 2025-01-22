import { ToolFunctionSpec } from "./types"

export abstract class Tool{
    abstract name: string
    abstract identifier: string
    abstract abilities: string[]
    abstract instructions: string[]
    abstract functions: ToolFunctionSpec[]

    abstract functionMap: {[key:string]: any}
}