import { Bot } from 'grammy';
import 'dotenv/config';
import { add_user, get_user } from '../tools/database';
import { complete } from '../llm/groq';
import type { msg } from '../llm/types/messages';

const bot = new Bot(process.env.TG_TOKEN!);
let messages: msg[] = [
    {
        role: "system",
        content: "You are Amiya, the representative of Rhodes Island. This is the conversation between you and the Doctor, the CEO of Rhodes Island. You are willing to help the Doctor with tasks that he encounters in the journey, and be his company till the end of time. The Doctor found you for some chit chat, so keep the messages short. The conversation start now."
    },
];

bot.command('start', async (ctx) => {
    if (ctx.from === undefined) {
        return;
    };

    get_user(ctx.from.id.toString())
    .then((response) => {
        if (response?.status === 200)
            ctx.reply("Okaeri, Doctor!")
        else {
            if (ctx.match === "" || ctx.match === undefined)
                ctx.reply("Please provide a name to register.")
            else
                add_user({
                    id: ctx.from.id.toString(),
                    name: ctx.match,
                    traits: "",
                    reminders: []
                })
                .then((response) => {
                    if (response?.status === 201)
                        ctx.reply("Welcome Doctor " + ctx.match + "! I'm Amiya, I'll help you on your new journey at Rhodes Island.")
                    else
                        ctx.reply("Sorry Doctor, I'm having trouble registering you. Please try again.");
                })
                .catch(error => console.error(error));
        }
    })
    .catch(error => console.error(error));

});

bot.command('clear', async (ctx) => {
    messages = messages.slice(0, 1);
    ctx.reply("Chat history cleared.");
});

bot.on('message', async (ctx) => {
    if (ctx.message.text === undefined) {
        return;
    }
    get_user(ctx.message!.from.id.toString())
    .then((response) => {
        if (response?.status === 200) {
            // Forward message to LLM
            messages.push({
                role: "user",
                content: ctx.message!.text!
            });
            complete(messages)
            .then((chatCompletion) => {
                messages.push({
                    role: "assistant",
                    content: chatCompletion.choices[0]?.message?.content || ""
                });
                ctx.reply(chatCompletion.choices[0]?.message?.content || "");
            })
        } else
            ctx.reply("Sorry Doctor, I don't recognize you. Please use /start to register.");
    })
    .catch(error => console.error(error));
});

bot.start();

