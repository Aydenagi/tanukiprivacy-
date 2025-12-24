import { emit } from "../router";

export function startProcessWatcher() {
  setInterval(() => {
    emit({
      type: "PROCESS_EVENT",
      pid: process.pid,
      detail: "simulated child process"
    });
  }, 5000);
}
