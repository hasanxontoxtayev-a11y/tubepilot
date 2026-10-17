---
name: grill-me
description: >-
  Interview the user relentlessly about a plan, design, or topic, checkpointing every answer to a
  brainstorm file so nothing is lost. Use when the user wants to stress-test a plan, get grilled on
  a design, run a brainstorm or discovery session, extract what's in their head into a doc, or says
  "grill me", "grill-me", "grill-me kanal", or "grill-me-kanal". Also triggered by the /grill-me slash command.
---

# Grill Me (Kanal)

Relentlessly interview the user about every aspect of a plan, design, or topic until reaching shared understanding. Walk down each branch of the decision tree, resolving dependencies one by one. The primary goal is to extract what is in the user's head into a durable, structured markdown file on disk so nothing is lost as context fills up or compacts.

---

## The Capture File is the Source of Truth

Long discovery interviews rapidly consume model context. Relying solely on conversational memory risks forgetting, conflating, or dropping crucial details.

**Rule:** Checkpoint to disk after **every single answer**. The file on disk—not the model's ephemeral context—is the single source of truth. Never wait for or make the user ask to save progress.

---

## Setup (Execute BEFORE the First Question)

1. **Resolve Today's Date**:
   - Check the current date from session metadata or environment.
   - If unknown, resolve via shell (PowerShell on Windows: `Get-Date -Format "yyyy-MM-dd"`, or Unix: `date +%F`).

2. **Create the Capture File**:
   - Target path: `brainstorms/{YYYY-MM-DD}-{topic-slug}.md`
   - Use `write_to_file` to initialize the file (create the `brainstorms/` folder if it doesn't exist).
   - **Important**: All brainstorm captures live strictly in `brainstorms/` at the workspace root. Do NOT scatter raw captures across project subfolders. If a session later produces a polished deliverable (a plan, a map, a spec), that artifact can move into the relevant `projects/` folder, but the raw capture always stays in `brainstorms/`.

3. **Initialize File Structure**:
   - Create the file immediately with the header structure: Title, Date, Goal of the session, an empty "Summary / key decisions" section, an empty "Q&A log", and an empty "Open flags" section.

4. **Announce and Start**:
   - In a single line, inform the user where the brainstorm is being recorded (e.g., *"Recording discovery session to [`brainstorms/2026-10-13-my-topic.md`](file:///path/to/brainstorms/2026-10-13-my-topic.md)"*).
   - Immediately follow with **Question 1 (Q1)**.

---

## The Checkpoint Rule (Non-Negotiable)

After **EVERY** user answer, and **BEFORE** asking the next question:

1. **Update Capture File**:
   - Append a structured entry to the capture file using `replace_file_content` or `write_to_file`:
     - Question topic
     - Key facts and decisions from their answer (quoting their exact words where phrasing matters)
     - Any flags (things they couldn't answer plus who should)
2. **Reconcile Past Entries**:
   - Update or correct earlier entries if a later answer changes or supersedes them. Update the running summary dynamically.
3. **Only Then Ask Next Question**:
   - Never batch multiple answers into one write. Checkpoint one answer at a time. If the conversation or context resets at any moment, the file already holds everything said so far.

---

## Interview Method & Antigravity Integration

- **One Question at a Time**: Never ask multiple questions in a single turn.
- **Provide Recommended Answer**: For each question, provide your best inference/recommendation from context so the user can simply confirm, adjust, or redirect.
- **Use Native Antigravity Tools**:
  - When a question involves distinct choices or architectural decisions, use the **`ask_question`** tool with selectable options. Always put your recommended answer first, prefixed with `(Recommended)`.
  - For open-ended questions, ask directly in chat with your recommended perspective clearly stated.
  - If a question can be answered by exploring the workspace codebase or reading files (`view_file`), do that autonomously instead of asking the user.
  - If the user provides a document or link, inspect it and only surface what is net-new.
- **Resolve Dependencies in Order**: Settle upstream decisions before the downstream ones that depend on them.
- **Handle Unknowns Gracefully**: When the user cannot answer something, capture it under `Open flags` with the appropriate owner and move forward without stalling.
- **Completeness Backstop**: Keep going until all branches of the decision tree are covered or the user signals completion. Offer a completeness backstop near the end: *"Is there anything else around this topic we haven't touched?"*

---

## Capture File Structure

Each file in `brainstorms/{YYYY-MM-DD}-{topic-slug}.md` must strictly follow this structure:

```markdown
# {Topic}: Brainstorm / Discovery Notes
Date: {date} · Goal: {one line}

## Summary / key decisions
(running synthesis, updated as you go)

## Q&A log
### Q1 — {topic}
- Asked: {question}
- Captured: {facts, decisions, in their words where it matters}
- Flags: {open item -> owner}

### Q2 — {topic}
- Asked: {question}
- Captured: {facts, decisions}
- Flags: {open item -> owner}
...

## Open flags (pending input)
- {item} -> {who can answer}
```

---

## Session Wrap-up

Once all branches are covered or the user indicates the session is complete:
1. **Audit & Reconcile**: Perform a final pass on the capture file to reconcile any contradictions or gaps.
2. **Summary Recap**: Provide the user with a concise recap in chat:
   - What has been captured and decided
   - What is still flagged / open
   - Clickable markdown link to the saved capture file: `[brainstorms/...](file:///...)`
   - Suggested next step (e.g., generating an implementation plan, drafting architecture spec, or creating tasks).
