import type { NeodocsState } from '../neodocs-state.js'

/**
 * Represents a Neodocs command function type.
 *
 * A Neodocs command is a function that takes the current Neodocs state and the
 * element that triggered the command.
 *
 * If the command is triggered by a keyboard event, the element is the active
 * panel in the Neodocs state; if the command is triggered by a mouse event,
 * the element is the target of the event; if the command is triggered by users,
 * the element is the active panel in the Neodocs state.
 */
export type NeoCommand = (
  ns: NeodocsState,
  element: Element,
  args: string[]
) => void
