
# Threat Model

This document defines the threat assumptions and scope of Tanuki.

---

## Defended Against

- Credential stealers
- Wallet drainers
- Clipboard hijackers
- Memory-resident malware
- Persistence-based malware
- Unauthorized signing workflows

---

## Attacker Capabilities Assumed

- Ability to run user-level processes
- Ability to inject into other processes
- Ability to use legitimate binaries
- Ability to evade signature-based scanners

---

## Out of Scope

- Kernel-level rootkits
- Firmware compromise
- Physical access attacks
- Enterprise EDR replacement

---

## Design Assumptions

- Signatures are unreliable
- Legitimate processes can be abused
- Detection must be behavioral and temporal
