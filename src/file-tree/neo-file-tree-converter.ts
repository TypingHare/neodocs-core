import { NeoFileNode } from './neo-file-node.js'
import { NeoFileTree } from './neo-file-tree.js'
import type { RawNeoFileNode, RawNeoFileTree } from './types.js'
import { marked } from 'marked'

/**
 * Represents a converter that transforms raw file tree data into a structured
 * NeoFileTree.
 */
export class NeoFileTreeConverter {
  /**
   * Unique identifier for each file node, incremented for each new node.
   */
  private id: number = 0

  /**
   * Converts a raw file tree into a structured NeoFileTree.
   *
   * @param fileTree - The raw file tree data to convert.
   * @returns A NeoFileTree instance containing the parsed file nodes.
   */
  parseFileTree(fileTree: RawNeoFileTree): NeoFileTree {
    return new NeoFileTree(this.parseFileNode(fileTree.root, null))
  }

  /**
   * Recursively parses a raw file node into a NeoFileNode.
   *
   * @param rawNode - The raw file node data to parse.
   * @param parent - The parent NeoFileNode, or null if this is the root node.
   * @returns A NeoFileNode instance representing the parsed file node.
   */
  parseFileNode(
    rawNode: RawNeoFileNode,
    parent: NeoFileNode | null
  ): NeoFileNode {
    const { type, title, path, content, children } = rawNode
    const fileNode = new NeoFileNode(this.id++, type, path, title, content)
    fileNode.parent = parent
    fileNode.htmlContent = marked.parse(content) as string
    fileNode.children = []

    if (children) {
      children.forEach((rawChild) => {
        if (fileNode.children) {
          fileNode.children.push(this.parseFileNode(rawChild, fileNode))
        }
      })
    }

    return fileNode
  }

  /**
   * Static method to convert a raw file tree into a NeoFileTree.
   *
   * @param fileTree - The raw file tree data to convert.
   * @returns A NeoFileTree instance containing the parsed file nodes.
   */
  static fromRawFileTree(fileTree: RawNeoFileTree): NeoFileTree {
    return new NeoFileTreeConverter().parseFileTree(fileTree)
  }
}
