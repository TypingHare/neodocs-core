import type { Keybinding, KeyComb } from './types.js'

export class KeymapNode {
  constructor(
    readonly keyComb: KeyComb = '',
    readonly keybindings: Keybinding[] = [],
    readonly parent: KeymapNode | null = null,
    readonly children: Record<KeyComb, KeymapNode> = {}
  ) {}

  get(keyCombArray: KeyComb[]): KeymapNode | null {
    if (keyCombArray.length === 0) {
      return this
    }

    const [head, ...tail] = keyCombArray
    if (head && head in this.children) {
      return this.children[head]!.get(tail)
    }

    return null
  }

  addKeybinding(keyCombArray: KeyComb[], keybinding: Keybinding): void {
    if (keyCombArray.length === 0) {
      this.keybindings.push(keybinding)
      return
    }

    const [head, ...tail] = keyCombArray
    if (head) {
      if (!(head in this.children)) {
        this.children[head] = new KeymapNode(head, [], this)
      }

      this.children[head]!.addKeybinding(tail, keybinding)
    }
  }

  removeKeybinding(keyCombArray: KeyComb[], keybinding: Keybinding): void {
    if (keyCombArray.length === 0) {
      const index = this.keybindings.indexOf(keybinding)
      if (index !== -1) {
        this.keybindings.splice(index, 1)
      }
      return
    }

    const [head, ...tail] = keyCombArray
    if (head && head in this.children) {
      this.children[head]!.removeKeybinding(tail, keybinding)
    }
  }
}
