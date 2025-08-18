import type { Mode } from '../types.js'
import { KeymapNode } from './keymap-node.js'
import type {
  Keybinding,
  KeybindingAction,
  KeybindingCondition,
  KeyComb,
  KeyCombOptions,
} from './types.js'

/**
 * A module for managing keymaps and keybindings.
 */
export class KeymapModule {
  /**
   * The root node of the keymap tree.
   */
  readonly keymapRoot: KeymapNode = new KeymapNode()

  /**
   * Generates a key combination string based on the provided options.
   *
   * @param opts - The options for generating the key combination.
   * @returns The generated key combination string.
   */
  getKeyComb(opts: KeyCombOptions): KeyComb {
    const { key, shift, ctrl, alt, meta, mouse } = opts
    let buf = ''
    if (shift) buf += 'S'
    if (ctrl) buf += 'C'
    if (alt) buf += 'A'
    if (meta) buf += 'M'
    if (mouse) buf += 'O'

    return buf ? `<${buf}-${key}>` : key
  }

  /**
   * Creates a new keybinding.
   *
   * @param keyComb - The key combination(s) that trigger the action.
   * @param action - The action to be performed when the key combination is
   *  triggered.
   * @param opts - Optional parameters including modes and condition.
   * @returns The created keybinding.
   */
  createKeybinding(
    keyComb: KeyComb | KeyComb[],
    action: KeybindingAction,
    opts: Partial<{ modes: Mode[]; condition: KeybindingCondition }> = {}
  ): Keybinding {
    const { modes = ['normal'], condition = null } = opts
    return { keyComb, modes, action, condition }
  }

  /**
   * Sets a keybinding in the keymap.
   *
   * @param keybinding - The keybinding to be set.
   * @returns The set keybinding.
   */
  setKeybinding(keybinding: Keybinding): Keybinding {
    const { keyComb } = keybinding
    const keyCombArray = Array.isArray(keyComb) ? keyComb : [keyComb]
    this.keymapRoot.addKeybinding(keyCombArray, keybinding)

    return keybinding
  }

  /**
   * Unsets a keybinding from the keymap.
   *
   * @param keybinding - The keybinding to be unset.
   * @returns The unset keybinding.
   */
  unsetKeybinding(keybinding: Keybinding): Keybinding {
    const { keyComb } = keybinding
    const keyCombArray = Array.isArray(keyComb) ? keyComb : [keyComb]
    this.keymapRoot.removeKeybinding(keyCombArray, keybinding)

    return keybinding
  }

  /**
   * Sets a key combination to an action with optional modes and condition.
   *
   * @param keyComb - The key combination(s) that trigger the action.
   * @param action - The action to be performed when the key combination is
   *  triggered.
   * @param opts - Optional parameters including modes and condition.
   * @returns The set keybinding.
   */
  set(
    keyComb: KeyComb | KeyComb[],
    action: KeybindingAction,
    opts: Partial<{ modes: Mode[]; condition: KeybindingCondition }> = {}
  ): Keybinding {
    return this.setKeybinding(this.createKeybinding(keyComb, action, opts))
  }

  /**
   * Gets the keybindings associated with a specific key combination.
   *
   * @param keyCombArray - An array of key combinations.
   * @returns An array of keybindings associated with the key combinations.
   */
  getKeybindings(keyCombArray: KeyComb[]): Keybinding[] {
    return this.keymapRoot.get(keyCombArray)?.keybindings || []
  }

  /**
   * Sets multiple keybindings in the keymap.
   *
   * @param keybindings - An array of keybindings to be set.
   * @param keybinding - The keybinding to be set.
   */
  setKeybindings(keybindings: Keybinding[]): void {
    keybindings.forEach((keybinding) => this.setKeybinding(keybinding))
  }

  /**
   * Unsets multiple keybindings from the keymap.
   *
   * @param keybindings - An array of keybindings to be unset.
   */
  unsetKeybindings(keybindings: Keybinding[]): void {
    keybindings.forEach((keybinding) => this.unsetKeybinding(keybinding))
  }
}
