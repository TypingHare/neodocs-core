import { NeoFileNode } from './neo-file-node.js'

export type NeoFileNodeType = 'file' | 'directory'

/**
 * Represents a raw Neodocs file node.
 */
export interface RawNeoFileNode {
  type: NeoFileNode['type']
  path: NeoFileNode['path']
  title: NeoFileNode['title']
  content: NeoFileNode['content']
  children: RawNeoFileNode[]
}

/**
 * Represents a function that generates a unique identifier for an HTML element.
 */
export type ElementIdProvider = (id: number) => string

/**
 * Represents the state of a Neodocs file tree.
 *
 * @property expandedIds - A set of IDs of currently expanded file nodes.
 * @property focusedId - The ID of the currently focused file node.
 * @property selectedId - The ID of the currently selected file node.
 */
export interface FileTreeState {
  expandedIds: Set<number>
  focusedId: number
  selectedId: number
}
