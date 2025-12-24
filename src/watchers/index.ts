import { startProcessWatcher } from "./processWatcher";
import { startFileWatcher } from "./fileWatcher";

export function startWatchers() {
  startProcessWatcher();
  startFileWatcher();
}
