export type TanukiEvent =
  | { type: "PROCESS_EVENT"; pid: number; detail: string }
  | { type: "FILE_EVENT"; path: string; sensitive: boolean }
  | { type: "NETWORK_EVENT"; pid: number; destination: string };

type Handler = (event: TanukiEvent) => void;

const handlers: Handler[] = [];

export function registerHandler(handler: Handler) {
  handlers.push(handler);
}

export function emit(event: TanukiEvent) {
  for (const handler of handlers) {
    handler(event);
  }
}
