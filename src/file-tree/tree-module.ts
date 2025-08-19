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
  /**
   * A mapping of tree names to their corresponding NeoFileTree instances.
   */
  readonly treeMap: Record<string, NeoFileTree> = {}

  /**
   * Creates a new NeoFileTree from raw data and stores it in the treeMap.
   *
   * @param name - The name to associate with the new file tree.
   * @param rawFileTree - The raw data to convert into a NeoFileTree.
   * @returns The newly created NeoFileTree instance.
   */
  create(name: string, rawFileTree: RawNeoFileTree): NeoFileTree {
    if (this.treeMap[name]) {
      throw new Error(`File tree with name "${name}" already exists.`)
    }

    this.treeMap[name] = NeoFileTreeConverter.fromRawFileTree(rawFileTree)

    return this.treeMap[name]
  }

  /**
   * Gets an existing NeoFileTree by name.
   *
   * @param name - The name of the file tree to retrieve.
   * @returns The NeoFileTree instance associated with the given name.
   *
   * @throws ReferenceError if no file tree with the given name exists.
   */
  get(name: string): NeoFileTree {
    const fileTree = this.treeMap[name]
    if (!fileTree) {
      throw new ReferenceError(`File tree with name "${name}" does not exist.`)
    }

    return fileTree
  }
}
