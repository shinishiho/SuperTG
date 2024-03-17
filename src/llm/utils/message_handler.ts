import XMLParser from 'fast-xml-parser/src/v5/XMLParser';
import { XMLBuilder } from 'fast-xml-parser';
import type { tool_call, tool_result, tool_error } from '../types/tools';
import function_call from './tool_handler';

const parser = new XMLParser();
const builder = new XMLBuilder();

class AIMessage {
    thinking?: string;
    function_calls?: tool_call;
    function_results?: tool_result | tool_error;
    answer?: string;
    end_turn: boolean;

    constructor(raw: string) {
        let obj = parser.parse(raw);
        this.thinking = obj.thinking;
        this.function_calls = obj.function_calls;
        this.answer = obj.answer;
        this.end_turn = false;
    }

    execute(): void {
        if (this.answer) {
            this.end_turn = true;
            return;
        }
        if (function_call) {
            this.function_results = function_call(this.function_calls!);
        }
    }

    toXML(): string {
        return builder.build({ thinking: this.thinking, function_calls: this.function_calls, function_results: this.function_results, answer: this.answer });
    }

}
