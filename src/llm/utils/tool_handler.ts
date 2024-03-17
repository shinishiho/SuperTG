import type { tool_call, tool_result, tool_error } from '../types/tools';
import fs from 'fs';
import { join } from 'path';

const CHAT_DIR = join(__dirname, '..', 'logs', 'function');

function function_call(call: tool_call): tool_result | tool_error {
    let stdout = "";
    const fn = call.invoke.tool_name;
    const params = call.invoke.parameters;
    try {
        switch (fn) {
            case "ls":
                stdout = fs.readdirSync(params[0]).join('\n');
                break;

            case "cat":
                stdout = fs.readFileSync(params[0], 'utf-8');
                break;

            case "echo":
                const [filename, content] = params[0].split('>')
                fs.writeFileSync(filename, content);
                stdout = `Wrote to ${params[1]}`;
                break;

            default:
                stdout = `Unknown tool: ${fn}`;
                break;
        }
    } catch (e: any) {
        return { error: e.message };
    }
    return { result: { tool_name: fn, stdout } };
}

export default function_call;
