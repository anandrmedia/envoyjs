export type ToolFunctionArg = {
    name: string
    description: string
    dataType: string
}

export type ToolFunctionSpec = {
    name: string
    purpose: string
    arguments: ToolFunctionArg[]
    response: string
}
