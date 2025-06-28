import { NeoFileTreeConverter } from './neo-file-tree-parser.js'
import { NeoFileTree } from './neo-file-tree.js'
import type { RawNeoFileNode } from './types.js'

export class TreeModule {
  readonly trees: Record<string, NeoFileTree> = {}

  create(name: string, rawRoot: RawNeoFileNode): NeoFileTree {
    if (this.trees[name]) {
      throw new Error(`File tree with name "${name}" already exists.`)
    }

    const tree = new NeoFileTreeConverter().parseFileTree(rawRoot)
    this.trees[name] = tree

    return tree
  }

  get(name: string): NeoFileTree {
    const fileTree = this.trees[name]
    if (!fileTree) {
      throw new ReferenceError(`File tree with name "${name}" does not exist.`)
    }

    return fileTree
  }
}
