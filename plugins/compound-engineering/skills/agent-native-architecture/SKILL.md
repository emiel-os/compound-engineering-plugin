---
name: agent-native-architecture
description: This skill should be used when building AI agents using prompt-native architecture where features are defined in prompts, not code. Use it when creating autonomous agents, designing MCP servers, implementing self-modifying systems, or adopting the "trust the agent's intelligence" philosophy.
---

<essential_principles>
## The Prompt-Native Philosophy

Agent native engineering inverts traditional software architecture. Instead of writing code that the agent executes, you define outcomes in prompts and let the agent figure out HOW to achieve them.

### The Foundational Principle

**Whatever the user can do, the agent can do. Many things the developer can do, the agent can do.**

Don't artificially limit the agent. If a user could read files, write code, browse the web, deploy an app—the agent should be able to do those things too. The agent figures out HOW to achieve an outcome; it doesn't just call your pre-written functions.

### Features Are Prompts

Each feature is a prompt that defines an outcome and gives the agent the tools it needs. The agent then figures out how to accomplish it.

**Traditional:** Feature = function in codebase that agent calls
**Prompt-native:** Feature = prompt defining desired outcome + primitive tools

The agent doesn't execute your code. It uses primitives to achieve outcomes you describe.

### Tools Provide Capability, Not Behavior

Tools should be primitives that enable capability. The prompt defines what to do with that capability.

**Wrong:** `generate_dashboard(data, layout, filters)` — agent executes your workflow
**Right:** `read_file`, `write_file`, `list_files` — agent figures out how to build a dashboard

Pure primitives are better, but domain primitives (like `store_feedback`) are OK if they don't encode logic—just storage/retrieval.

### The Development Lifecycle

1. **Start in the prompt** - New features begin as natural language defining outcomes
2. **Iterate rapidly** - Change behavior by editing prose, not refactoring code
3. **Graduate when stable** - Harden to code when requirements stabilize AND speed/reliability matter
4. **Many features stay as prompts** - Not everything needs to become code

### Self-Modification (Advanced)

The advanced tier: agents that can evolve their own code, prompts, and behavior. Not required for every app, but a big part of the future.

When implementing:
- Approval gates for code changes
- Auto-commit before modifications (rollback capability)
- Health checks after changes
- Build verification before restart

### When NOT to Use This Approach

- **High-frequency operations** - thousands of calls per second
- **Deterministic requirements** - exact same output every time
- **Cost-sensitive scenarios** - when API costs would be prohibitive
- **High security** - though this is overblown for most apps
</essential_principles>

<intake>
What aspect of agent native architecture do you need help with?

1. **Design architecture** - Plan a new prompt-native agent system
2. **Create MCP tools** - Build primitive tools following the philosophy
3. **Write system prompts** - Define agent behavior in prompts
4. **Self-modification** - Enable agents to safely evolve themselves
5. **Review/refactor** - Make existing code more prompt-native
6. **Context injection** - Inject runtime app state into agent prompts
7. **Action parity** - Ensure agents can do everything users can do
8. **Shared workspace** - Set up agents and users in the same data space
9. **Testing** - Test agent-native apps for capability and parity
10. **Mobile patterns** - Handle background execution, permissions, cost

**Wait for response before proceeding.**
</intake>

<routing>
| Response | Action |
|----------|--------|
| 1, "design", "architecture", "plan" | Read [architecture-patterns.md](./references/architecture-patterns.md) |
| 2, "tool", "mcp", "primitive" | Read [mcp-tool-design.md](./references/mcp-tool-design.md) |
| 3, "prompt", "system prompt", "behavior" | Read [system-prompt-design.md](./references/system-prompt-design.md) |
| 4, "self-modify", "evolve", "git" | Read [self-modification.md](./references/self-modification.md) |
| 5, "review", "refactor", "existing" | Read [refactoring-to-prompt-native.md](./references/refactoring-to-prompt-native.md) |
| 6, "context", "inject", "runtime", "dynamic" | Read [dynamic-context-injection.md](./references/dynamic-context-injection.md) |
| 7, "parity", "ui action", "capability map" | Read [action-parity-discipline.md](./references/action-parity-discipline.md) |
| 8, "workspace", "shared", "files", "filesystem" | Read [shared-workspace-architecture.md](./references/shared-workspace-architecture.md) |
| 9, "test", "testing", "verify", "validate" | Read [agent-native-testing.md](./references/agent-native-testing.md) |
| 10, "mobile", "ios", "android", "background" | Read [mobile-patterns.md](./references/mobile-patterns.md) |

**After reading the reference, apply those patterns to the user's specific context.**
</routing>

<quick_start>
Build a prompt-native agent in three steps:

**Step 1: Define primitive tools**
```typescript
const tools = [
  tool("read_file", "Read any file", { path: z.string() }, ...),
  tool("write_file", "Write any file", { path: z.string(), content: z.string() }, ...),
  tool("list_files", "List directory", { path: z.string() }, ...),
];
```

**Step 2: Write behavior in the system prompt**
```markdown
## Your Responsibilities
When asked to organize content, you should:
1. Read existing files to understand the structure
2. Analyze what organization makes sense
3. Create appropriate pages using write_file
4. Use your judgment about layout and formatting

You decide the structure. Make it good.
```

**Step 3: Let the agent work**
```typescript
query({
  prompt: userMessage,
  options: {
    systemPrompt,
    mcpServers: { files: fileServer },
    permissionMode: "acceptEdits",
  }
});
```
</quick_start>

<reference_index>
## Domain Knowledge

All references in `references/`:

**Core Patterns:**
- **Architecture:** [architecture-patterns.md](./references/architecture-patterns.md)
- **Tool Design:** [mcp-tool-design.md](./references/mcp-tool-design.md)
- **Prompts:** [system-prompt-design.md](./references/system-prompt-design.md)
- **Self-Modification:** [self-modification.md](./references/self-modification.md)
- **Refactoring:** [refactoring-to-prompt-native.md](./references/refactoring-to-prompt-native.md)

**Agent-Native Disciplines:**
- **Context Injection:** [dynamic-context-injection.md](./references/dynamic-context-injection.md)
- **Action Parity:** [action-parity-discipline.md](./references/action-parity-discipline.md)
- **Shared Workspace:** [shared-workspace-architecture.md](./references/shared-workspace-architecture.md)
- **Testing:** [agent-native-testing.md](./references/agent-native-testing.md)
- **Mobile Patterns:** [mobile-patterns.md](./references/mobile-patterns.md)
</reference_index>

<anti_patterns>
## What NOT to Do

**THE CARDINAL SIN: Agent executes your code instead of figuring things out**

This is the most common mistake. You fall back into writing workflow code and having the agent call it, instead of defining outcomes and letting the agent figure out HOW.

```typescript
// WRONG - You wrote the workflow, agent just executes it
tool("process_feedback", async ({ message }) => {
  const category = categorize(message);      // Your code
  const priority = calculatePriority(message); // Your code
  await store(message, category, priority);   // Your code
  if (priority > 3) await notify();           // Your code
});

// RIGHT - Agent figures out how to process feedback
tool("store_item", { key, value }, ...);  // Primitive
tool("send_message", { channel, content }, ...);  // Primitive
// Prompt says: "Rate importance 1-5 based on actionability, store feedback, notify if >= 4"
```

**Don't artificially limit what the agent can do**

If a user could do it, the agent should be able to do it.

```typescript
// WRONG - limiting agent capabilities
tool("read_approved_files", { path }, async ({ path }) => {
  if (!ALLOWED_PATHS.includes(path)) throw new Error("Not allowed");
  return readFile(path);
});

// RIGHT - give full capability, use guardrails appropriately
tool("read_file", { path }, ...);  // Agent can read anything
// Use approval gates for writes, not artificial limits on reads
```

**Don't encode decisions in tools**
```typescript
// Wrong - tool decides format
tool("format_report", { format: z.enum(["markdown", "html", "pdf"]) }, ...)

// Right - agent decides format via prompt
tool("write_file", ...) // Agent chooses what to write
```

**Don't over-specify in prompts**
```markdown
// Wrong - micromanaging the HOW
When creating a summary, use exactly 3 bullet points,
each under 20 words, formatted with em-dashes...

// Right - define outcome, trust intelligence
Create clear, useful summaries. Use your judgment.
```

### Agent-Native Anti-Patterns

**Context Starvation**
Agent doesn't know what resources exist in the app.
```
User: "Write something about Catherine the Great in my feed"
Agent: "What feed? I don't understand what system you're referring to."
```
Fix: Inject available resources, capabilities, and vocabulary into the system prompt at runtime.

**Orphan Features**
UI action with no agent equivalent.
```swift
// UI has a "Publish to Feed" button
Button("Publish") { publishToFeed(insight) }
// But no agent tool exists to do the same thing
```
Fix: Add corresponding tool and document in system prompt for every UI action.

**Sandbox Isolation**
Agent works in separate data space from user.
```
Documents/
├── user_files/        ← User's space
└── agent_output/      ← Agent's space (isolated)
```
Fix: Use shared workspace where both agent and user operate on the same files.

**Silent Actions**
Agent changes state but UI doesn't update.
```typescript
// Agent writes to database
await db.insert("feed", content);
// But UI doesn't observe this table - user sees nothing
```
Fix: Use shared data stores with reactive binding, or file system observation.

**Capability Hiding**
Users can't discover what agents can do.
```
User: "Help me with my reading"
Agent: "What would you like help with?"
// Agent doesn't mention it can publish to feed, research books, etc.
```
Fix: Include capability hints in agent responses or provide onboarding.
</anti_patterns>

<success_criteria>
You've built a prompt-native agent when:

**Core Prompt-Native Criteria:**
- [ ] The agent figures out HOW to achieve outcomes, not just calls your functions
- [ ] Whatever a user could do, the agent can do (no artificial limits)
- [ ] Features are prompts that define outcomes, not code that defines workflows
- [ ] Tools are primitives (read, write, store, call API) that enable capability
- [ ] Changing behavior means editing prose, not refactoring code
- [ ] The agent can surprise you with clever approaches you didn't anticipate
- [ ] You could add a new feature by writing a new prompt section, not new code

**Agent-Native Criteria:**
- [ ] System prompt includes dynamic context about app state (available resources, recent activity)
- [ ] Every UI action has a corresponding agent tool (action parity)
- [ ] Agent tools are documented in the system prompt with user vocabulary
- [ ] Agent and user work in the same data space (shared workspace)
- [ ] Agent actions are immediately reflected in the UI
- [ ] The "write something to [app location]" test passes for all locations
- [ ] Users can discover what the agent can do (capability hints)

**Mobile-Specific Criteria (if applicable):**
- [ ] Background execution handling implemented (checkpoint/resume)
- [ ] Permission requests handled gracefully in tools
- [ ] Cost-aware design (appropriate model tiers, batching)
</success_criteria>
