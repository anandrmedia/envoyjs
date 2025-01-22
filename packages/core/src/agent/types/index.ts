export type AgentResponse = {
    message: string,
    use_tool?: {
        identifier: string
        function_name: string,
        args: string[],
    },
}