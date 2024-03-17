interface tool_param {
    name: string;
    type: string;
    description: string;
}

interface tool {
    name: string;
    description: string;
    params: tool_param[];
}

interface tool_call {
    invoke: {
        tool_name: string;
        parameters: {
            [key: string]: string;
        };
    };
}

interface tool_result {
    result: {
        tool_name: string;
        stdout: string;
    };
}

interface tool_error {
    error: string;
}

export type {
    tool,
    tool_param,
    tool_call,
    tool_result,
    tool_error,
};
