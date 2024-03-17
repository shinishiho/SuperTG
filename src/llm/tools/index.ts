import tools from './tools.json';

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

function construct_tool_param (params: tool_param) {
    let tool_param = [
        "<parameter>",
        `<name>${params.name}</name>`,
        `<type>${params.type}</type>`,
        `<description>${params.description}</description>`,
        "</parameter>",
    ].join('\n');

    return tool_param;
}

function construct_tool (params: tool) {
    let tool = [
        "<tool_description>",
        `<tool_name>${params.name}</tool_name>`,
        "<description>",
        `${params.description}`,
        "</description>",
        "<parameters>",
        params.params.map(construct_tool_param).join('\n'),
        "</parameters>",
        "</tool_description>"
    ].join('\n');

    return tool;
}

const constructed_tools = tools.tools.map(construct_tool).join('\n');
const main_tool = construct_tool(tools.main_tool);

export {
   main_tool
};
