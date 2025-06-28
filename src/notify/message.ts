import type { NotifyLevel } from './types.js'

/**
 * Represents a message in the notification system.
 *
 * A message is like a log entry. It contains an ID, a timestamp, a Notify
 * level, and the message text.
 */
export class Message {
  /**
   * Creates a new Message instance.
   *
   * @param id - The unique identifier for the message.
   * @param timestamp - The JavaScript timestamp when the message was created.
   * @param level - The Notify level of the message.
   * @param message - The text of the message.
   */
  constructor(
    public readonly id: number,
    public readonly timestamp: number,
    public readonly level: NotifyLevel,
    public readonly message: string
  ) {}
}
