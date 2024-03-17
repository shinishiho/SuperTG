import llm_config from './config.json';
import { constructed_tools } from './tools';
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';

const system_prompt = [
    llm_config.upper_prompt,
    constructed_tools,
    llm_config.lower_prompt
].join('\n');

const stream = createWriteStream(join(__dirname, 'system_prompt.txt'));
stream.write(system_prompt);
stream.end();
