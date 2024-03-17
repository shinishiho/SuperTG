import { ChatAnthropicTools } from '@langchain/anthropic/experimental';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const model = new ChatAnthropicTools({
    temperature: 0.5,
    modelName: "claude-3-haiku-20240307",
    maxTokens: 1024,
});

model.bind({
    tools: [
        {
            type: "function",
            function: {
                name: "get_current_weather",
                description: "Get the current weather in a given location",
                parameters: {
                    type: "object",
                    properties: {
                        location: {
                            type: "string",
                            description: "The city and state, e.g. San Francisco, CA",
                        },
                        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
                    },
                    required: ["location"],
                },
            },
        },
    ],
    // You can set the `function_call` arg to force the model to use a function
    tool_choice: {
        type: "function",
        function: {
            name: "get_current_weather",
        },
    },
});

const messages = [
    new SystemMessage("You are a helpful assistant"),
    new HumanMessage("Hi, what's the weather in San Francisco?"),
];

const res = await model.invoke(messages);
console.log(res);
console.log(res.additional_kwargs.tool_calls);
