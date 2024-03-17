/**
 * Add, modify or delete user's reminders. Reminders have two keys: "time" (reminder due time, put "no time" if it doesn't have one) and "content" (the content of the reminder)
 *
 * @param {number} index The reminder's index to take action. Specify an out-of-range value to add a reminder at that index
 * @param {number} action The action to take. 0 for delete, 1 to add/modify
 * @param {object} content The content of the reminder to add/modify. Ignored if action is 0. Possible keys: time, content
 * @returns {number} action result. 0 for success, 1 for failure
 */
export function reminder(id: string, index: number, action: number, content: object): number {
    return 0;
}

/**
 * Update user's traits and personalities in the database.
 *
 * @param {string} content The new traits and personalities description string
 * @returns {number} action result. 0 for success, 1 for failure
 *
 */
export function update_traits(id: string, content: string): number {
    return 0;
}
