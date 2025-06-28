import { NeoFileNode } from './neo-file-node.js'
import { NeoFileTree } from './neo-file-tree.js'
import type { RawNeoFileNode } from './types.js'
import { marked } from 'marked'

export class NeoFileTreeConverter {
  private id: number = 0

  parseFileTree(rawRoot: RawNeoFileNode): NeoFileTree {
    return new NeoFileTree(this.parseFileNode(rawRoot, null))
  }

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
}
