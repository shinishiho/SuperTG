import type { reminder } from './reminder.ts';

export interface user {
    id: string,
    name: string,
    traits: string,
    reminders: reminder[],
}
