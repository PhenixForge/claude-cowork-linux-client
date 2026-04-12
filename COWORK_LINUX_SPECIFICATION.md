# Claude Cowork for Linux — Specification & Vision

## What Is Claude Cowork?

Claude Cowork is an agentic work platform built for tasks that require real effort: pulling information from many sources, making sense of it, and producing something finished.

Unlike Chat (simple Q&A), Cowork gives Claude:
- **Scope**: Access to your files, tools, web, and apps
- **Stamina**: Multi-step planning, parallel execution, scheduled automation
- **Intelligence**: Asks clarifying questions upfront, builds a reviewable plan, coordinates complex workflows
- **Independence**: Can run tasks in background, spin up subagents in parallel, maintain persistent context across sessions

---

## Core Cowork Capabilities

### 1. **Agentic Planning & Execution**
- User provides a goal or question
- Claude asks clarifying questions (scope, format, constraints, deadline)
- Claude builds a step-by-step plan that the user can review
- Claude executes the plan, handling multi-step work autonomously
- User sees progress: sources being drawn, files taking shape, plan progress

**Example**: "Review what we decided about pricing last quarter across meeting notes, Slack, and email, then update our Q3 deck"
- Claude asks: What format for the summary? Should I include historical data? Who needs approval?
- Claude builds plan: (1) Search Slack for pricing discussions, (2) Extract email threads, (3) Review meeting transcripts, (4) Synthesize findings, (5) Update deck
- Claude executes in parallel where possible, reports progress

### 2. **Folder & File Access**
- Point Claude to a folder on your computer
- Claude reads what's there, understands relevance, saves finished work back to same place
- No manual file uploads needed for bulk work
- Protected environment: Claude can only access shared folders, not the whole system

**Use cases**:
- "Review these 50 contracts and find all non-standard payment terms"
- "Summarize the Q2 financial reports and extract KPIs for the board deck"
- "Reorganize this folder of research notes by theme and create an index"

### 3. **Scheduled Recurring Tasks**
- Define a task that runs on a schedule (daily, weekly, etc.)
- Claude handles it automatically each time the app is open
- Catches up if computer was closed during scheduled run
- Examples:
  - Daily briefing: pulls from Slack, calendar, email; delivers summary each morning
  - Weekly roundup: what shipped, what changed, what's next
  - Morning inbox triage: sorts what needs your attention from all sources

### 4. **Subagents & Parallel Execution**
- Claude breaks complex tasks into subtasks
- Spins up multiple subagents to work on parts in parallel
- Each subagent has its own context, tools, and autonomy
- Claude coordinates results into one finished deliverable

**Example**: Research brief on 10 competitors
- Subagent 1: Research competitor A's pricing, features, company size
- Subagent 2: Research competitor B's pricing, features, company size
- ... (in parallel)
- Subagent 10: Research competitor J's pricing, features, company size
- Main agent: Synthesizes all findings into structured comparison matrix with sources

### 5. **Tool Integrations & Context Sources**
- **Folder access**: Read from and write to local directories
- **File uploads**: Paste or drag files into conversation
- **Connectors**: Slack (read threads, reactions, history), Calendar, Email, Google Drive
- **Browser**: Chrome connector—Claude navigates websites, extracts data, no manual tab-switching
- **Computer use**: Direct interaction—clicking, typing, opening apps (macOS first, Windows coming)
- **Plugins**: Extend capabilities (financial data, compliance frameworks, internal knowledge bases)

### 6. **Projects & Workspaces**
- Group related tasks into dedicated projects
- Each project has:
  - Its own conversation threads
  - Shared context and instructions
  - Local file access (folder on disk)
  - Memory (what was discussed, what was decided)
  - Persistent history
- Switch between projects; each maintains state

### 7. **Conversation Persistence & Context**
- Cowork conversations are persistent threads (not one-shot)
- Claude maintains context: previous decisions, files created, patterns learned
- You can return to a conversation days later and continue where you left off
- Project memory means Claude knows what happened across all tasks in that project

### 8. **Dispatch (Mobile Integration)**
- Persistent conversation thread accessible from mobile app
- Hand tasks from phone to desktop: "Review these 3 documents when my computer is on"
- Claude uses all desktop resources (files, connectors, plugins)
- Requires both apps open and desktop awake

---

## Use Cases That Cowork Is Built For

### Research & Analysis
- "Research a new market: find 10 competitors, pull their pricing, features, company size, and funding. Deliver a structured briefing with sources."
- "Review our Q2 performance: pull data from analytics, sales, product, engineering. Synthesize into a board memo."
- "Evaluate 5 project management tools: visit their sites, test features, compare pricing, write a recommendation."

### Document & Data Processing
- "Extract all financial data from 50 PDFs and create a consolidated Excel sheet with quarterly trends."
- "Review these 20 contracts and flag any unusual terms, missing clauses, or compliance issues."
- "Take these meeting transcripts, Slack messages, and email threads about pricing strategy and write a synthesis memo."

### Routine Automation
- "Every morning at 8am, pull my calendar, unread emails, and Slack messages, then write a daily briefing."
- "Every Friday, aggregate what shipped this week and what's planned for next, then post to Slack."
- "Monitor this folder for new documents. When something arrives, extract key data and update the index."

### Coordinated Complex Work
- "Build a slide deck from material spread across meeting notes, reports, and Slack. Include visuals, synthesize findings, suggest narrative flow."
- "Create a contract from a template, fill in the terms we negotiated, get it reviewed for compliance, and save it."
- "Scrape competitor pricing across 10 websites, consolidate into a matrix, identify gaps in our offering."

---

## Claude Cowork for Linux — Target Specification

### What The Linux Client Should Do

The Linux client is a **native desktop agent** that brings real Cowork capabilities to Linux users. It is NOT a thin wrapper around Claude—it's a full agent framework with Cowork's autonomy and reach.

#### Phase 1: Core Agent & Filesystem (MVP)
- [x] Basic UI: Home page with quick actions, custom prompt input
- [ ] **Multi-step planner**: Break down user goals into steps, user reviews plan before execution
- [ ] **Filesystem access**: Read from/write to user-designated folders safely
- [ ] **Agentic execution**: Work through steps autonomously, handling errors and retries
- [ ] **Context persistence**: Maintain conversation history across sessions
- [ ] **Task state management**: Track what's running, what's done, what failed

#### Phase 2: Document Processing & Scheduling
- [ ] **PDF/Excel/Word extraction**: Read and analyze business documents
- [ ] **Data synthesis**: Combine data from multiple sources
- [ ] **Report generation**: Create Markdown, Excel, or PDF reports
- [ ] **Scheduled tasks**: Define recurring work (daily briefing, weekly roundup)
- [ ] **Background execution**: Tasks run while you work on other things

#### Phase 3: Tool Integrations (MCP)
- [ ] **Notion connector**: Read/write Notion databases
- [ ] **Slack connector**: Read messages, threads, reactions; optionally post
- [ ] **Email connector**: Read inbox, search, extract data
- [ ] **Google Drive**: List, read, upload files
- [ ] **Custom connectors**: Let users define integrations

#### Phase 4: Advanced Autonomy
- [ ] **Subagents**: Claude spins up background workers for parts of a task
- [ ] **Browser use**: Open and navigate websites to extract data (if X11/Wayland allows)
- [ ] **Computer use**: Interact with Linux apps directly (click, type, open programs)
- [ ] **Error recovery**: Detect failures and suggest solutions
- [ ] **Parallel execution**: Multiple tasks running at once, each in its own context

#### Phase 5: UX Polish & Deployment
- [ ] **Projects/workspaces**: Group related tasks with shared context
- [ ] **Progress visualization**: See sources being drawn, files being created, plan progress
- [ ] **Settings**: Configure allowed folders, API keys, plugins, environment
- [ ] **Tauri packaging**: Self-contained Linux app (AppImage, deb, rpm)
- [ ] **Dark mode & accessibility**: Polish the interface

---

## Architectural Requirements

### Backend (Python + FastAPI)
- **Agent engine**: Multi-step planning, execution, error handling
- **Task queue**: Run tasks in background, schedule recurring work
- **Subagent dispatcher**: Spin up child agents for parallel execution
- **Filesystem sandbox**: Safe read/write to designated folders
- **Context manager**: Persistent conversation history + project memory
- **Tool registry**: MCP integrations, connectors, plugins
- **Error recovery**: Detect failures, suggest fixes, retry intelligently

### Frontend (React + TypeScript)
- **Home page**: Quick actions, custom input, workspace selector
- **Cowork mode**: Task input, plan review, progress tracking, file browser
- **Project view**: Conversation threads, shared context, task history
- **Settings**: Configure environment, API keys, allowed folders
- **Notifications**: Background task completion, errors, schedule alerts

### Infrastructure
- **API layer**: Communication between frontend and agent backend
- **Database**: SQLite or local (no cloud dependency)
- **File I/O**: Safe reading/writing to user-designated folders
- **Process management**: Long-running agent tasks, subagent lifecycle
- **Logging**: Detailed logs for debugging and auditability

---

## Success Criteria

A successful Linux Cowork client:

1. **Can handle multi-step tasks** without user intervention between steps
2. **Reads and writes files** safely within designated folders
3. **Asks clarifying questions** before executing (when needed)
4. **Shows a plan** that users can review before work starts
5. **Executes autonomously** and reports progress
6. **Maintains context** across sessions—you can return to a task days later
7. **Handles errors gracefully**—retries, suggests solutions, doesn't crash
8. **Runs scheduled tasks** automatically on a defined schedule
9. **Supports parallel work** via subagents for complex tasks
10. **Integrates with tools** (Slack, Notion, Drive) via MCP
11. **Is packaged as a native Linux app** (not a web wrapper)
12. **Feels responsive and polished** in the UI

---

## Out of Scope (For Now)

- Mobile app / Dispatch feature (requires Claude app ecosystem)
- Browser automation (would need Selenium/Playwright integration)
- Full computer use/desktop automation (future: controlled via permissions)
- Voice input/output
- Collaborative editing (multi-user sync)
- Cloud backup/sync

---

## Key Differentiator from Chat

| Aspect | Chat | Cowork |
|--------|------|--------|
| **Scope** | Answer questions | Access your files, tools, web |
| **Planning** | Responds to each message | Builds a multi-step plan upfront |
| **Execution** | User coordinates steps | Claude works autonomously |
| **Context** | Per-conversation | Project-level memory |
| **Automation** | Manual requests | Scheduled recurring tasks |
| **Parallelism** | Sequential | Subagents work in parallel |
| **Interaction** | Interactive chat | Reviews, then executes |

---

## Reference: What Real Cowork Can Do (macOS/Web)

Claude Cowork is available to Pro, Max, Team, and Enterprise users on macOS and web. Key capabilities:

- ✅ Multi-step planning with user review
- ✅ Folder access (read all, save results)
- ✅ Scheduled recurring tasks
- ✅ Subagents for parallel work
- ✅ Connectors (Slack, Calendar, Email, Drive)
- ✅ Browser use (navigate websites, extract data)
- ✅ Computer use (click, type, open apps on macOS)
- ✅ Plugins for domain-specific work
- ✅ Protected environment (sandboxed file access)
- ✅ Projects with persistent memory

The Linux client should match this vision—adapted for Linux filesystem conventions and tools.

---

## Development Priority

**Phase 1 (Core)** is the minimum viable product—without it, it's just another task executor. Focus:
1. Multi-step planner
2. Filesystem access
3. Agentic execution
4. Error recovery
5. Context persistence

**Phase 2–5** add layers of capability and polish. Prioritize by user need.

---

## Questions to Decide

1. **Scope for v1**: Full Cowork feature set, or a focused subset (e.g., "document analysis only")?
2. **Browser automation**: Worth the complexity, or start with folder + connectors only?
3. **Computer use**: Critical for your use cases, or nice-to-have?
4. **Scheduling**: Needed from the start, or add after core agent works?
5. **MCP integrations**: Which tools matter most for your workflow?

This document should evolve as priorities become clearer. It's the north star for "what we're building."
