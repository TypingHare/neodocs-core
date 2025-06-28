import { NeoFileNode } from './neo-file-node.js'
import type { ElementIdProvider, FileTreeState } from './types.js'

export class NeoFileTree {
  byId: Record<number, NeoFileNode> = {}
  byPath: Record<string, NeoFileNode> = {}

  constructor(readonly root: NeoFileNode) {
    this.hash(this.root)
  }

  get(id: number): NeoFileNode
  get(path: string): NeoFileNode
  get(idOrPath: number | string): NeoFileNode {
    let id: number | undefined = idOrPath as number
    if (typeof idOrPath === 'string') {
      id = this.byPath[idOrPath]?.id
      if (id === undefined) {
        throw new ReferenceError(`Node with path "${idOrPath}" not found`)
      }
    }

    const node = this.byId[id]
    if (!node) {
      throw new ReferenceError(`Node with ID ${id} not found`)
    }

    return node
  }

  getElement(id: number, elementIdProvider: ElementIdProvider): HTMLElement
  getElement(
    path: number | string,
    elementIdProvider: (id: number) => string
  ): HTMLElement
  getElement(
    idOrPath: number | string,
    elementIdProvider: (id: number) => string
  ): HTMLElement {
    const id = this.get(idOrPath as number).id
    const elementId = elementIdProvider(id)
    const element = document.getElementById(elementId)
    if (!element) {
      throw new ReferenceError(`Element with ID "${elementId}" not found`)
    }

    return element
  }

  /**
   * Hashes the given node and its children into the byId and byPath maps.
   *
   * @param node - The NeoFileNode to hash.
   */
  hash(node: NeoFileNode) {
    this.byId[node.id] = node
    this.byPath[node.path] = node

    for (const child of node.children || []) {
      this.hash(child)
    }
  }

  /**
   * Rehashes the Neodocs file tree, clearing the byId and byPath maps and
   * rehashing from the root.
   */
  rehash() {
    this.byId = {}
    this.byPath = {}
    this.hash(this.root)
  }

  expand(state: FileTreeState, nodeIds: number[]): void {
    state.expandedIds = new Set([...state.expandedIds, ...nodeIds])
  }

  collapse(state: FileTreeState, nodeIds: number[]): void {
    state.expandedIds = new Set(
      [...state.expandedIds].filter((id) => !nodeIds.includes(id))
    )
  }

  select(state: FileTreeState, nodeId?: number) {
    state.selectedId = nodeId ? nodeId : state.focusedId
  }
}
