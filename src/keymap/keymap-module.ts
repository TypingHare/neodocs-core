import type { Mode } from '../types.js'
import { KeymapNode } from './keymap-node.js'
import type {
  Keybinding,
  KeybindingAction,
  KeybindingCondition,
  KeyComb,
  KeyCombOptions,
} from './types.js'

export class KeymapModule {
  readonly keymapRoot: KeymapNode = new KeymapNode()

  getKeyComb(options: KeyCombOptions): KeyComb {
    const { key, shift, ctrl, alt, meta, mouse } = options
    let buf = ''
    if (shift) buf += 'S'
    if (ctrl) buf += 'C'
    if (alt) buf += 'A'
    if (meta) buf += 'M'
    if (mouse) buf += 'O'

    return buf ? `<${buf}-${key}>` : key
  }

  createKeybinding(
    keyComb: KeyComb | KeyComb[],
    action: KeybindingAction,
    opts: Partial<{ modes: Mode[]; condition: KeybindingCondition }> = {}
  ): Keybinding {
    const { modes = ['normal'], condition = null } = opts
    return { keyComb, modes, action, condition }
  }

  setKeybinding(keybinding: Keybinding): Keybinding {
    const { keyComb } = keybinding
    const keyCombArray = Array.isArray(keyComb) ? keyComb : [keyComb]
    this.keymapRoot.addKeybinding(keyCombArray, keybinding)

    return keybinding
  }

  unsetKeybinding(keybinding: Keybinding): Keybinding {
    const { keyComb } = keybinding
    const keyCombArray = Array.isArray(keyComb) ? keyComb : [keyComb]
    this.keymapRoot.removeKeybinding(keyCombArray, keybinding)

    return keybinding
  }

  bind(
    keyComb: KeyComb | KeyComb[],
    action: KeybindingAction,
    opts: Partial<{ modes: Mode[]; condition: KeybindingCondition }> = {}
  ): Keybinding {
    return this.createKeybinding(keyComb, action, opts)
  }

  set(
    keyComb: KeyComb | KeyComb[],
    action: KeybindingAction,
    opts: Partial<{ modes: Mode[]; condition: KeybindingCondition }> = {}
  ): Keybinding {
    return this.setKeybinding(this.createKeybinding(keyComb, action, opts))
  }

  getKeybindings(keyCombArray: KeyComb[]): Keybinding[] {
    return this.keymapRoot.get(keyCombArray)?.keybindings || []
  }

  setKeybindings(keybindings: Keybinding[]): void {
    keybindings.forEach((keybinding) => this.setKeybinding(keybinding))
  }

  unsetKeybindings(keybindings: Keybinding[]): void {
    keybindings.forEach((keybinding) => this.unsetKeybinding(keybinding))
  }
}
