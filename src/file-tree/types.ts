import { NeoFileNode } from './neo-file-node.js'

export type NeoFileNodeType = 'file' | 'directory'

/**
 * Represents a raw Neodocs file node.
 *
 * @property type - The type of the file node, either 'file' or 'directory'.
 * @property path - The file path of the node.
 * @property title - The title of the file node.
 * @property content - The content of the file. If the node is a directory, it
 *   would be the content of the "index.md" file within that directory.
 */
export interface RawNeoFileNode {
  type: NeoFileNode['type']
  path: NeoFileNode['path']
  title: NeoFileNode['title']
  content: NeoFileNode['content']
  children: RawNeoFileNode[]
}

/**
 * Represents a raw Neodocs file tree.
 *
 * @property root - The root node of the file tree.
 */
export interface RawNeoFileTree {
  root: RawNeoFileNode
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
