import { emit } from "../router";

export function startFileWatcher() {
  setInterval(() => {
    emit({
      type: "FILE_EVENT",
      path: "/fake/wallet/path",
      sensitive: true
    });
  }, 8000);
}
