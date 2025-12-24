# Examples and Use Cases

This document describes concrete scenarios Tanuki is designed to detect and respond to.

---

## Clipboard Hijacking

### Scenario
A background process monitors the system clipboard and replaces copied sensitive strings.

### Signals
- Repeated clipboard access by a non-foreground process
- Clipboard access followed by outbound network activity
- Process not signed or spawned from a trusted parent

### Events Emitted
- PROCESS_EVENT
- FILE_EVENT (clipboard buffer)
- NETWORK_EVENT

### Outcome
- Risk score escalates over time
- Local alert raised
- Optional isolation if enabled

---

## Unauthorized Wallet File Access

### Scenario
A malicious process scans local storage directories for credential material.

### Signals
- File access to sensitive paths
- Access pattern inconsistent with known wallet software
- No user-initiated foreground activity

### Outcome
- Alert before any transaction occurs
- Optional process isolation

Tanuki does not require chain awareness to detect this behavior.

---

## Memory-Resident Malware

### Scenario
Malware injects into a legitimate process and avoids disk writes.

### Signals
- Abnormal child process creation
- Injection-like behavior
- Periodic outbound beaconing

### Outcome
- Behavior correlation over time
- Detection without file signatures

---

## Persistence Mechanisms

### Scenario
Malware attempts to survive reboot.

### Signals
- New startup entries
- Scheduled task creation
- Background agent registration

### Outcome
- Alert prior to reboot
- Clear persistence signal

---

## Malicious Extension Activity

### Scenario
A browser extension silently accesses sensitive resources.

### Signals
- Unexpected file access
- Network activity unrelated to user interaction
- Memory access patterns inconsistent with browsing

### Outcome
- Alert without extension name or browser integration
