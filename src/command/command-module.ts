import type { NeodocsState } from '../neodocs-state.js'
import { ROOT_PANEL_ID } from '../panel/constants.js'
import type { NeoCommand } from './types.js'

/**
 * CommandModule is a class that manages a collection of commands.
 */
export class CommandModule {
  readonly commands: Record<string, NeoCommand[]> = {}

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

  unset(name: string, command: NeoCommand): void {
    const commands = this.commands[name]
    if (commands) {
      this.commands[name] = commands.filter((it) => it !== command)
    } else {
      console.warn(`Command "${name}" not found for unsetting`)
    }
  }

  unsetAll(name: string): void {
    if (this.commands[name]) {
      delete this.commands[name]
    }
  }

  get(name: string): NeoCommand {
    const commands = this.commands[name]
    if (!commands || commands.length === 0) {
      throw new ReferenceError(`Command "${name}" not found`)
    }

    return commands[commands.length - 1]!
  }

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

  schedule(
    ns: NeodocsState,
    name: string,
    element?: Element,
    args: string[] = []
  ): void {
    setTimeout(() => this.run(ns, name, element, args))
  }
}
