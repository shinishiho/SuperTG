interface msg {
    role: "user" | "assistant",
    content: string,
};

interface chat {
    messages: msg[],
    chat_id: string,
};

export type { msg, chat };
