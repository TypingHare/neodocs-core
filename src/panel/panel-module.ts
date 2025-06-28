import type { NeodocsState } from '../neodocs-state.js'
import type { Neodocs } from '../neodocs.js'
import { ROOT_PANEL_ID } from './constants.js'
import { NeoPanel } from './neo-panel.js'

export class PanelModule {
  /**
   * Creates a new instance of the PanelModule.
   *
   * @param neodocs - The Neodocs instance that this module belongs to.
   */
  constructor(readonly neodocs: Neodocs) {}

  /**
   * A mapping of panel IDs to their corresponding Neodocs panel instances.
   */
  readonly byId: Record<string, NeoPanel> = {}

  /**
   * Creates a new Neodocs panel.
   *
   * @param id - The unique identifier of the panel; also the ID of the
   *   corresponding HTML element in the DOM.
   * @param type - The type of the panel.
   * @param parentId - The ID of the parent panel, if any. Defaults to null.
   * @return A new instance of Neodocs panel.
   */
  create(id: string, type: string, parentId: string | null = null): NeoPanel {
    const parent = parentId ? this.byId[parentId] || null : null
    const panel = new NeoPanel(this.neodocs, id, type, parent)
    this.byId[id] = panel

    return panel
  }

  /**
   * Gets a panel by its ID.
   *
   * @param id - The ID of the panel to retrieve.
   * @returns The Neodocs panel instance corresponding to the given ID.
   * @throws {ReferenceError} If the panel with the given ID does not exist.
   */
  get(id: string): NeoPanel {
    const neoPanel = this.byId[id]
    if (!neoPanel) {
      throw new ReferenceError(`Panel with ID ${id} not found`)
    }

    return neoPanel
  }

  /**
   * Gets an HTML element by its ID and casts it to the specified type.
   *
   * @param <T> - The type to cast the HTML element to.
   * @param id - The ID of the HTML element to retrieve.
   * @returns The HTML element with the specified ID, cast to the specified
   *   type.
   * @throws {ReferenceError} If the element with the given ID does not exist.
   */
  getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T
    if (!element) {
      throw new ReferenceError(`Element with ID ${id} not found`)
    }

    return element
  }

  /**
   * Shows a collection of panels.
   *
   * This method updates the displayed ID set in the Neodocs state to include
   * the given panel IDs.
   *
   * @param ns - The Neodocs state.
   * @param panelIds - The IDs of the panels to show.
   */
  showAll(ns: NeodocsState, panelIds: string[]): void {
    ns.panel.displayedIds = new Set([...ns.panel.displayedIds, ...panelIds])
  }

  /**
   * Hides a collection of panels.
   *
   * This method updates the displayed ID set in the Neodocs state to remove
   * the specified panel IDs.
   *
   * This method also removes the specified panel IDs from the active ID stack,
   * ensuring that they are no longer considered active.
   *
   * @param ns - The Neodocs state.
   * @param panelIds - The IDs of the panels to hide.
   */
  hideAll(ns: NeodocsState, panelIds: string[]): void {
    ns.panel.displayedIds = new Set(
      [...ns.panel.displayedIds].filter((id) => !panelIds.includes(id))
    )

    ns.panel.activeIdStack = ns.panel.activeIdStack.filter(
      (id) => !panelIds.includes(id)
    )
  }

  /**
   * Shows a panel and activates it by pushing its ID onto the active ID stack.
   *
   * This method also ensures that the panel is in the displayed ID set.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to show and activate.
   */
  show(ns: NeodocsState, panelId: string): void {
    this.showAll(ns, [panelId])
  }

  /**
   * Hides a panel by removing its ID from the displayed ID set.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to hide.
   */
  hide(ns: NeodocsState, panelId: string): void {
    this.hideAll(ns, [panelId])
  }

  /**
   * Activates a panel by pushing its ID onto the active ID stack.
   *
   * This method also ensures that the panel is in the displayed ID set.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to activate.
   */
  activate(ns: NeodocsState, panelId: string): void {
    if (!ns.panel.displayedIds.has(panelId)) {
      this.showAll(ns, [panelId])
    }

    ns.panel.activeIdStack.push(panelId)
  }

  /**
   * Deactivates the currently active panel by popping its ID from the active
   * ID stack.
   *
   * @param ns - The Neodocs state.
   * @return True if a panel was deactivated, false if the active ID stack is
   *   empty or contains only the root panel ID.
   */
  deactivate(ns: NeodocsState): boolean {
    if (ns.panel.activeIdStack.length > 1) {
      ns.panel.activeIdStack.pop()
      return true
    }

    return false
  }

  /**
   * Deactivates all panels until the specified panel ID is reached in the
   * active ID stack.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to deactivate until.
   * @param include - If true, the specified panel ID will also be deactivated.
   */
  deactivateAllUntil(
    ns: NeodocsState,
    panelId: string,
    include: boolean = false
  ): void {
    const index = ns.panel.activeIdStack.indexOf(panelId)
    if (index === -1) {
      ns.panel.activeIdStack = []
      return
    }

    const endIndex = include ? index + 1 : index
    ns.panel.activeIdStack = ns.panel.activeIdStack.slice(0, endIndex)
  }

  /**
   * Gets the ID of the currently active panel.
   *
   * If no panel is active, it returns the root panel ID. But theoretically,
   * the root panel should always be active and the first element in the active
   * ID stack.
   *
   * @param ns - The Neodocs state.
   * @returns The ID of the currently active panel.
   */
  getActiveId(ns: NeodocsState): string {
    return ns.panel.activeIdStack.at(-1) ?? ROOT_PANEL_ID
  }

  /**
   * Gets the currently active panel.
   *
   * If no panel is active, it returns the root panel.
   *
   * @param ns - The Neodocs state.
   * @returns The currently active Neodocs panel instance.
   */
  getActive(ns: NeodocsState): NeoPanel {
    return this.get(this.getActiveId(ns))
  }

  /**
   * Gets the currently active HTML element.
   *
   * If no panel is active, it returns the root panel's HTML element.
   *
   * @param <T> - The type to cast the HTML element to.
   * @param ns - The Neodocs state.
   * @returns The currently active HTML element cast to the specified type.
   */
  getActiveElement<T extends HTMLElement>(ns: NeodocsState): T {
    return this.getElement<T>(this.getActiveId(ns))
  }

  /**
   * Shows a panel and all its parent panels, and activates it.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to open.
   */
  open(ns: NeodocsState, panelId: string): void {
    const displayedIds = ns.panel.displayedIds
    const panelToAdd = []
    let currentPanel: NeoPanel | null = this.get(panelId)
    while (
      currentPanel &&
      currentPanel.id !== ROOT_PANEL_ID &&
      !displayedIds.has(currentPanel.id)
    ) {
      panelToAdd.push(currentPanel.id)
      currentPanel = currentPanel.parent
    }

    if (panelToAdd.length > 0) {
      this.showAll(ns, panelToAdd.reverse())
    }

    this.activate(ns, panelId)
  }

  /**
   * Hides a panel and all its descendant panels, and deactivates the descendant
   * panels, if any.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to close.
   */
  close(ns: NeodocsState, panelId: string): void {
    const descendantPanelIds = this.get(panelId).getAllDescendantIds()
    this.hideAll(ns, descendantPanelIds)

    ns.panel.activeIdStack = ns.panel.activeIdStack.filter(
      (id) => !descendantPanelIds.includes(id)
    )
  }

  /**
   * Toggles the visibility of a panel based on its current state.
   *
   * If the panel is currently displayed, it will be hidden; otherwise, it will
   * be shown.
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to toggle.
   */
  toggleDisplay(ns: NeodocsState, panelId: string): void {
    if (ns.panel.displayedIds.has(panelId)) {
      this.hide(ns, panelId)
    } else {
      this.show(ns, panelId)
    }
  }

  /**
   * Toggles the active state of a panel.
   *
   * This method checks if the panel is currently active. If it is, the panel
   * is closed (deactivated); otherwise, it is opened (activated).
   *
   * @param ns - The Neodocs state.
   * @param panelId - The ID of the panel to toggle.
   */
  toggleActive(ns: NeodocsState, panelId: string): void {
    if (ns.panel.activeIdStack.includes(panelId)) {
      this.close(ns, panelId)
    } else {
      this.open(ns, panelId)
    }
  }

  /**
   * Switches from the currently active panel to another.
   *
   * This method hides and deactivates the currently active panel, then shows
   * and activates the specified panel.
   *
   * @param ns - The Neodocs state.
   * @param toPanelId - The ID of the panel to switch to.
   */
  switch(ns: NeodocsState, toPanelId: string): void {
    this.hide(ns, toPanelId)
    this.activate(ns, toPanelId)
  }
}
