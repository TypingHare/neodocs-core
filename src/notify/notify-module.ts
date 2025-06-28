import { Message } from './message.js'
import type { NotifyLevel } from './types.js'

/**
 * Represents a notification module that collects Notify messages.
 */
export class NotifyModule {
  /**
   * Message list collected by this Notify module.
   */
  readonly messages: Message[] = []

  /**
   * Adds a message to the message list.
   *
   * @param message - The message text to add.
   * @param level - The Notify level of the message. Defaults to 'info'.
   * @returns The newly created Message instance.
   */
  addMessage(message: string, level: NotifyLevel = 'info'): Message {
    const _message = new Message(
      this.messages.length,
      new Date().getTime(),
      level,
      message
    )
    this.messages.push(_message)

    return _message
  }

  /**
   * Adds a debug message to the message list.
   */
  debug(message: string) {
    this.addMessage(message, 'debug')
  }

  /**
   * Adds an info message to the message list.
   */
  info(message: string) {
    this.addMessage(message, 'info')
  }

  /**
   * Adds a warning message to the message list.
   */
  warn(message: string) {
    this.addMessage(message, 'warn')
  }

  /**
   * Adds an error message to the message list.
   */
  error(message: string) {
    this.addMessage(message, 'error')
  }

  /**
   * Intercepts console messages and adds them to the message list.
   *
   * This method overrides the default console methods (debug, log, warn, error)
   * to capture messages and add them to the NotifyModule's message list.
   */
  interceptConsoleMessages() {
    const originalDebug = console.debug
    const originalInfo = console.log
    const originalWarn = console.warn
    const originalError = console.error

    console.debug = (message: string) => {
      originalDebug(message)
      this.debug(message)
    }

    console.log = (message: string) => {
      originalInfo(message)
      this.info(message)
    }

    console.warn = (message: string) => {
      originalWarn(message)
      this.warn(message)
    }

    console.error = (message: string) => {
      originalError(message)
      this.error(message)
    }
  }
}
