import type { NeoCommand } from '../command/index.js'
import type { NeodocsState } from '../neodocs-state.js'
import type { Mode } from '../types.js'

/**
 * A key combination is a string that represents a keyboard shortcut.
 */
export type KeyComb = string

/**
 * Represents a condition that determines whether a keybinding is active.
 *
 * A keybinding condition is a function that takes the current Neodocs state and
 * the element that triggered the keybinding. It returns true if the keybinding
 * should be active, false otherwise.
 *
 * @param ns - The current Neodocs state.
 * @param element - The element that triggered the keybinding.
 * @returns true if the keybinding is active, false otherwise.
 */
export type KeybindingCondition = (
  ns: NeodocsState,
  element: Element
) => boolean

/**
 * Represents a keybinding action, which can be a Neodocs command or a string
 * that associated with a Neodocs command.
 *
 * @see NeoCommand
 */
export type KeybindingAction = NeoCommand | string

/**
 * Represents a keybinding that maps a key combination to an action in a
 * specific mode. A keybinding can have multiple key combinations and can be
 * active in multiple modes.
 *
 * @property keyComb - The key combination(s) that trigger the action.
 * @property modes - The modes in which the key combination is active.
 * @property action - The action to be performed when the key combination is
 *   pressed.
 */
export interface Keybinding {
  keyComb: KeyComb | KeyComb[]
  modes: Mode[]
  action: KeybindingAction
  condition: KeybindingCondition | null
}

/**
 * Represents a collection of ingredients for a key combination.
 *
 * @property key - The key to be pressed.
 * @property shift - Whether the Shift key should be pressed.
 * @property ctrl - Whether the Control key is pressed.
 * @property alt - Whether the Alt key is pressed.
 * @property meta - Whether the Meta key (Command on macOS) is pressed.
 * @property mouse - Whether the key combination is associated with a mouse
 *   event.
 */
export interface KeyCombOptions {
  key: string
  shift?: boolean
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  mouse?: boolean
}
