export type AgentMessage = {
    type: "string" | "json",
    message: string | Record<string, any>
}

export type AgentResponse = {
    task_completed: boolean,
    response?: AgentMessage,
    use_tool?: {
        identifier: string
        function_name: string,
        args: string[],
    },
}