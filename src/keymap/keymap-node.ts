import type { Keybinding, KeyComb } from './types.js'

/**
 * A node in the keymap tree structure.
 */
export class KeymapNode {
  /**
   * Creates a new KeymapNode.
   *
   * @param keyComb - The key combination that this node represents.
   * @param keybindings - The keybindings associated with this node.
   * @param parent - The parent node of this node.
   * @param children - The child nodes of this node.
   */
  constructor(
    readonly keyComb: KeyComb = '',
    readonly keybindings: Keybinding[] = [],
    readonly parent: KeymapNode | null = null,
    readonly children: Record<KeyComb, KeymapNode> = {}
  ) {}

  /**
   * Retrieves a child node based on the provided key combination array.
   *
   * @param keyCombArray - An array of key combinations representing the path
   *   to the desired node.
   * @returns The KeymapNode corresponding to the provided key combination
   *   array, or null if not found.
   */
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

  /**
   * Adds a keybinding to the keymap tree.
   *
   * @param keyCombArray - An array of key combinations representing the path
   *   to the node where the keybinding should be added.
   * @param keybinding - The keybinding to be added.
   */
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

  /**
   * Removes a keybinding from the keymap tree.
   *
   * @param keyCombArray - An array of key combinations representing the path
   *   to the node where the keybinding should be removed.
   * @param keybinding - The keybinding to be removed.
   */
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
