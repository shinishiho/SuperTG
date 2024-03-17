import type { msg } from './types/messages';
import { get_ai_response } from './index';
import 'dotenv/config';

var msg_history: msg[] = [];

const system_msg = `System information: Time: ${new Date().toLocaleString("en-US",{timeZone:"Asia/Jakarta", hour12:false})}. Reminders: None.`;

const usr_msg = "ShiniShiho: ";

msg_history.push({role: "user", content: [system_msg, usr_msg].join("\n")});

get_ai_response(msg_history).then((response) => {
    console.log(response);
});
