import { CommandModule } from './command/index.js'
import { TreeModule } from './file-tree/tree-module.js'
import { KeymapModule } from './keymap/index.js'
import { NotifyModule } from './notify/index.js'
import { PanelModule } from './panel/index.js'

/**
 * Represents the main Neodocs application.
 */
export class Neodocs {
  readonly notify = new NotifyModule()
  readonly command = new CommandModule()
  readonly keymap = new KeymapModule()
  readonly panel = new PanelModule(this)
  readonly tree = new TreeModule()
}
