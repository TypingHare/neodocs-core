import type { Mode } from './types.js'
import type { KeyComb } from './keymap/index.js'

/**
 * Basic Neodocs state interface.
 *
 * @property mode - The current mode of Neodocs.
 * @property keyCombBuffer - The buffer for key combinations.
 * @property panel - The state of the panel, including displayed IDs and
 *   activate IDs.
 */
export interface NeodocsState {
  mode: Mode
  keyCombBuffer: KeyComb[]
  panel: {
    displayedIds: Set<string>
    activeIdStack: string[]
  }
}
