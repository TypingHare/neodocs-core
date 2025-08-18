import { NeoFileTreeConverter } from './neo-file-tree-converter.js'
import { NeoFileTree } from './neo-file-tree.js'
import type { RawNeoFileTree } from './types.js'

/**
 * The TreeModule class manages a collection of NeoFileTree instances.
 *
 * It allows creating new trees from raw data and retrieving existing trees by
 * name.
 */
export class TreeModule {
  readonly trees: Record<string, NeoFileTree> = {}

  create(name: string, rawFileTree: RawNeoFileTree): NeoFileTree {
    if (this.trees[name]) {
      throw new Error(`File tree with name "${name}" already exists.`)
    }

    this.trees[name] = NeoFileTreeConverter.fromRawFileTree(rawFileTree)

    return this.trees[name]
  }

  get(name: string): NeoFileTree {
    const fileTree = this.trees[name]
    if (!fileTree) {
      throw new ReferenceError(`File tree with name "${name}" does not exist.`)
    }

    return fileTree
  }
}
