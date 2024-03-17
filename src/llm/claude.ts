import XMLParser from 'fast-xml-parser/src/v5/XMLParser';
import { XMLBuilder } from 'fast-xml-parser';
import readline from 'readline';
import Anthropic from "@anthropic-ai/sdk";
import llm_config from './config.json';
import { readFile } from 'fs';
import { join } from 'path';
import type { msg } from './types/messages';
import type { tool_call, tool_result, tool_error } from './types/tools';
import Chat from './utils/chat_handler';
import function_call from './utils/tool_handler';

const parser = new XMLParser();
const builder = new XMLBuilder();

const anthropic = new Anthropic();
const system_prompt = await new Promise<string>((resolve, reject) => {
    readFile(join(__dirname, 'system_prompt.txt'), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    });
});

async function ai_response(messages: msg[]): Promise<any> {
    return await anthropic.messages.create({
        model: llm_config.model,
        max_tokens: llm_config.max_tokens,
        temperature: llm_config.temperature,
        system: system_prompt,
        messages: messages,
        stop_sequences: ["</function_calls>"]
    });
}

const chat = new Chat();

console.log("Welcome to Test Chat. ChatID:", chat.chat_id);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const time = `Time: ${new Date(Date.now()).toLocaleString('en-GB', { timeZone: "UTC" })}\n`;
rl.question(time, async (input) => {
    if (input === "exit") {
        rl.close();
        return;
    }

    chat.new_message({role: "user", content: time + input});
    let response = await ai_response(chat.chat_history);
    let parsed_response = parser.parse(response.content[0].text);
    while (parsed_response.function_calls) {
        let result = function_call(parsed_response.function_calls);
        response.content[0].text += builder.build({ functions_results: { result } });
        chat.new_message({role: "assistant", content: response.content[0].text});
    }
    chat.new_message({role: "assistant", content: response.content[0].text});
    console.log(response.content[0].text + "\n");
});

rl.on('close', () => {
    console.log("Goodbye!");
    process.exit(0);
});
