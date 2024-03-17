import Grok from 'groq-sdk';
import type { msg } from './types/messages';

const groq = new Grok({
    apiKey: process.env.GROQ_API_KEY!,
});

async function complete(messages: msg[]) {
    const completion = await groq.chat.completions.create({
        messages: messages,
        model: "mixtral-8x7b-32768",
        temperature: 1,
        max_tokens: 1024,
        top_p: 0.5,
    });

    return completion;
}

export { complete };
