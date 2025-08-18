import type { Neodocs } from '../neodocs.js'
import { ROOT_PANEL_ID } from './constants.js'

/**
 * Represents a panel in Neodocs.
 */
export class NeoPanel {
  constructor(
    readonly neodocs: Neodocs,
    readonly id: string,
    readonly type: string,
    readonly parent: NeoPanel | null = null,
    readonly children: NeoPanel[] = []
  ) {}

  /**
   * Checks if a panel is a descendant of another panel.
   *
   * Note that a panel is the descendant of itself.
   *
   * @param panelId - The ID of the panel to check.
   * @param parentId - The ID of the potential ancestor panel.
   */
  isDescendantOf(panelId: string, parentId: string): boolean {
    if (panelId === parentId) {
      return true
    }

    let panel = this.neodocs.panel.get(panelId)
    while (panel.id !== ROOT_PANEL_ID) {
      if (!panel.parent) return false
      if (panel.parent.id === parentId) return true

      panel = panel.parent
    }

    return false
  }

  /**
   * Checks if a panel is an ancestor of another panel.
   *
   * Note that a panel is the ancestor of itself.
   *
   * @param panelId - The ID of the panel to check.
   * @param childId - The ID of the potential descendant panel.
   */
  isAncestorOf(panelId: string, childId: string): boolean {
    if (panelId === childId) {
      return true
    }

    for (const child of this.neodocs.panel.get(panelId).children) {
      if (this.isAncestorOf(child.id, childId)) {
        return true
      }
    }

    return false
  }

  /**
   * Gets all descendant panel IDs, including the panel's own ID.
   *
   * @return An array of all descendant panel IDs.
   */
  getAllDescendantIds(): string[] {
    const descendants: string[] = []

    const collectDescendants = (panel: NeoPanel) => {
      descendants.push(panel.id)
      for (const child of panel.children) {
        collectDescendants(child)
      }
    }

    collectDescendants(this)

    return descendants
  }
}
