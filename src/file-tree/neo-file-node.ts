import type { NeoFileNodeType } from './types.js'

/**
 * Represents a Neodocs file node.
 *
 * @property htmlContent - HTML content of the file node.
 * @property parent - Parent node of the file node.
 * @property children - Children nodes of the file node.
 */
export class NeoFileNode {
  htmlContent: string = ''
  parent: NeoFileNode | null = null
  children: NeoFileNode[] | null = null

  /**
   * Creates a NeoFileNode instance.
   *
   * @param id - Unique identifier for the file node.
   * @param type - Type of the file node (file or directory).
   * @param path - Path of the file node.
   * @param title - Title of the file node.
   * @param content - Content of the file node. It is the raw content of the
   *   file instead of the HTML content.
   */
  constructor(
    readonly id: number,
    readonly type: NeoFileNodeType,
    readonly path: string,
    readonly title: string,
    readonly content: string
  ) {}
}
