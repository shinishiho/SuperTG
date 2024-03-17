import type { msg, chat } from '../types/messages';
import jsonl from 'jsonl';
import { parse } from 'json5';
import fs from 'fs';
import { join } from 'path';
import { obj } from 'through2';

const CHAT_DIR = join(__dirname, '..', 'logs', 'chat');

function gc_chat(): void {
  const json_files = fs.readdirSync(CHAT_DIR).filter((filename) => filename.endsWith('.json'));
  
  if (json_files.length >= 15) {
      json_files.sort().slice(0,10);

      let stream = obj();
      stream.pipe(jsonl({toBufferStream:true}))
      .pipe(fs.createWriteStream(join(CHAT_DIR, `${json_files[0]}l`)));

      json_files.forEach((file) => {
          const full_path = join(CHAT_DIR, file);
          const content = fs.readFileSync(full_path, 'utf-8');
          const chat = parse(content) as chat;
          stream.push(chat);
          fs.unlinkSync(full_path);
      });

      stream.end();
  }
}

class Chat {
    chat_id: string;
    chat_history: msg[];

    constructor() {
        this.chat_id = Date.now().toString();
        this.chat_history = [];

        gc_chat();
        this.save();
    }

    save(): void {
        const file = join(CHAT_DIR, `${this.chat_id}.json`);
        fs.writeFileSync(file, JSON.stringify(this));
    }

    new_message(msg: msg): void {
        this.chat_history.push(msg);
        this.save();
    }
}

export default Chat;
