import Anthropic from '@anthropic-ai/sdk';
import llm_config from './config.json';
import type { msg } from './types/messages';
import { constructed_tools } from './tools';
import { get_user } from '../tools/database';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // This is the default and can be omitted
});

function construct_sys_msg(id: string) {
    let lower_prompt = llm_config.lower_prompt;
    let system_msg: string;
    get_user(id)
    .then((response) => {
        if (response?.status === 200) {
            system_msg = [
                `Time: ${new Date().toLocaleString("en-US",{timeZone:"Asia/Jakarta", hour12:false})}.`,
                `Reminders: ${response.data.reminders.join(", ")}.`,
            ].join("\n");
            lower_prompt.replace("<usernames>", response.data.name);
            lower_prompt.replace("<traits>", response.data.traits);
        }
    })
    .catch(error => console.error(error));
    
}

async function get_ai_response(msg_history: msg[] = []) {
  const message = await anthropic.messages.create({
    max_tokens: llm_config.max_tokens,
    messages: msg_history,
    system: [
        llm_config.upper_prompt,
        constructed_tools,
        llm_config.lower_prompt
    ].join('\n'),
    model: llm_config.model,
  });

  return message;
}

export { get_ai_response };
