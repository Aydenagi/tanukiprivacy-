# Architecture

Tanuki is event-driven and deterministic.

---

## High-Level Flow

Watchers emit raw system events.
Core logic scores behavior.
Responder executes configured actions.

---

## Event Types

- PROCESS_EVENT
- FILE_EVENT
- NETWORK_EVENT

Events are stateless individually but meaningful in aggregate.

---

## Core Components

- Watchers: signal collection only
- Router: event dispatch
- Heuristics: risk scoring
- Responder: action execution

No component bypasses this flow.

---

## Determinism

- No hidden models
- Explicit weights
- Explicit thresholds
- Auditable outcomes
