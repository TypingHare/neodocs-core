/**
 * The ID of the root panel.
 */
export const ROOT_PANEL_ID = 'panel-root'

/**
 * Builtin panel types.
 *
 * @property 'root' - The root panel type. Only the root panel can have this
 *   type.
 * @property 'container' - A container panel type.
 * @property 'sidebar' - A sidebar panel type.
 * @property 'file-tree' - A file tree panel type.
 * @property 'floating' - A floating panel type.
 */
export type PanelType =
  | 'root'
  | 'container'
  | 'sidebar'
  | 'file-tree'
  | 'floating'
  | string
