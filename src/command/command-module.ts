import type { NeodocsState } from '../neodocs-state.js'
import { ROOT_PANEL_ID } from '../panel/constants.js'
import type { NeoCommand } from './types.js'

/**
 * Represents a module that manages a collection of Neodocs commands.
 */
export class CommandModule {
  /**
   * Mapping from Neodocs command names to Neodocs commands.
   */
  readonly commands: Record<string, NeoCommand[]> = {}

  /**
   * Sets a Neodocs command.
   *
   * @param name - The name of Neodocs command to set.
   * @param command - The Neodocs command to set.
   * @param overwrite - Whether to overwrite all other Neodocs command with the
   *   same name. When set to true, all other Neodocs commands will be unset
   *   before the new one is set.
   */
  set(name: string, command: NeoCommand, overwrite = false): void {
    if (overwrite) {
      this.unsetAll(name)
    }

    const commands = this.commands[name]
    if (commands) {
      commands.push(command)
    } else {
      this.commands[name] = [command]
    }
  }

  /*
   * Unsets a Neodocs command.
   *
   * @param name - The name of the Neodocs command to unset.
   * @param command - The Neodocs command to unset.
   */
  unset(name: string, command: NeoCommand): void {
    const commands = this.commands[name]
    if (commands) {
      this.commands[name] = commands.filter((it) => it !== command)
    } else {
      console.warn(`Command "${name}" not found for unsetting`)
    }
  }

  /**
   * Unsets all Neodocs command with a specific name.
   *
   * @param name - The name of the Neodocs commands to unset.
   */
  unsetAll(name: string): void {
    if (this.commands[name]) {
      delete this.commands[name]
    }
  }

  /**
   * Gets a Neodocs command with a specific name.
   *
   * @param name - The name of the Neodocs command to get.
   */
  get(name: string): NeoCommand {
    const commands = this.commands[name]
    if (!commands || commands.length === 0) {
      throw new ReferenceError(`Command "${name}" not found`)
    }

    return commands[commands.length - 1]!
  }

  /**
   * Runs a specific Neodocs command.
   *
   * @param ns - Neodocs state.
   * @param name - The name of the Neodocs command to run.
   * @param element - The element that is active or focused.
   * @param args - Other arguments.
   *
   * @see NeoCommand
   */
  run(
    ns: NeodocsState,
    name: string,
    element?: Element,
    args: string[] = []
  ): void {
    const elementId = ns.panel.activeIdStack.at(-1) || ROOT_PANEL_ID
    const _element = element || document.getElementById(elementId)
    if (!_element) {
      throw new ReferenceError(`Element with ID "${elementId}" not found`)
    }

    this.get(name)(ns, _element, args)
  }

  /**
   * Schedules a specific Neodocs command.
   *
   * This method uses the `setTimeout` function to delay the execution of the
   * Neodocs command.
   *
   * @param ns - Neodocs state.
   * @param name - The name of the Neodocs command to run.
   * @param element - The element that is active or focused.
   * @param args - Other arguments.
   *
   * @see NeoCommand
   */
  schedule(
    ns: NeodocsState,
    name: string,
    element?: Element,
    args: string[] = []
  ): void {
    setTimeout(() => this.run(ns, name, element, args))
  }
}
