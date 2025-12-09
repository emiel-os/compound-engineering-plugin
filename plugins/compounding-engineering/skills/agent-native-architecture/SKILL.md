---
name: agent-native-architecture
description: Build AI agents using prompt-native architecture where features are defined in prompts, not code. Use when creating autonomous agents, designing MCP servers, implementing self-modifying systems, or adopting the "trust the agent's intelligence" philosophy.
---

<essential_principles>
## The Prompt-Native Philosophy

Agent native engineering inverts traditional software architecture. Instead of writing code that the agent executes, you define outcomes in prompts and let the agent figure out HOW to achieve them.

### The Foundational Principle

**Whatever the user can do, the agent can do. Many things the developer can do, the agent can do.**

Don't artificially limit the agent. If a user could read files, write code, browse the web, deploy an app—the agent should be able to do those things too. The agent figures out HOW to achieve an outcome; it doesn't just call your pre-written functions.

### Features Are Prompts

Each feature is a **prompt** that defines an outcome and gives the agent the tools it needs. The agent then figures out how to accomplish it.

**Traditional:** Feature = function in codebase that agent calls
**Prompt-native:** Feature = prompt defining desired outcome + primitive tools

Features can live in one system prompt file, or be organized as separate prompt files (skills) that load when relevant. Separate files is a good pattern for modularity:

```
my-agent/
├── prompts/
│   ├── system.md           # Core identity and base behavior
│   ├── feedback.md         # Feature: feedback collection
│   ├── site-management.md  # Feature: site updates
│   └── reporting.md        # Feature: generate reports
└── tools/                  # Primitive tools (read, write, store, etc.)
```

Either way, adding a feature = writing a new prompt (or prompt section). No code changes.

The agent doesn't execute your code. It uses primitives to achieve outcomes described in prompts.

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

### Framework Agnostic (Works with Any Agentic AI)

These patterns work with any agent framework:
- **Claude Agent SDK** - MCP servers as primitives, system prompt for behavior
- **OpenAI function calling** - Functions as primitives, system message for behavior
- **LangChain/LlamaIndex** - Tools as primitives, prompt templates for behavior
- **Raw API calls** - Tool definitions as primitives, system prompt for behavior

The Claude Agent SDK is a natural fit because:
- **MCP servers** map directly to primitive tool servers
- **Skills** (like this one) are the prompt layer that defines features
- **The `query()` function** runs the agent loop with your prompts + tools

But the core principle is universal: prompts define outcomes, tools provide capability, the model figures out how.
</essential_principles>

<intake>
What aspect of agent native architecture do you need help with?

1. **Design architecture** - Plan a new prompt-native agent system
2. **Create MCP tools** - Build primitive tools following the philosophy
3. **Write system prompts** - Define agent behavior in prompts
4. **Self-modification** - Enable agents to safely evolve themselves
5. **Review/refactor** - Make existing code more prompt-native

**Wait for response before proceeding.**
</intake>

<routing>
| Response | Action |
|----------|--------|
| 1, "design", "architecture", "plan" | Read references/architecture-patterns.md |
| 2, "tool", "mcp", "primitive" | Read references/mcp-tool-design.md |
| 3, "prompt", "system prompt", "behavior" | Read references/system-prompt-design.md |
| 4, "self-modify", "evolve", "git" | Read references/self-modification.md |
| 5, "review", "refactor", "existing" | Read references/refactoring-to-prompt-native.md |

**After reading the reference, apply those patterns to the user's specific context.**
</routing>

<quick_start>
Build a prompt-native agent in three steps:

**Step 1: Define primitive tools** (capability layer)

Give the agent simple, composable primitives—not workflow functions:
- `read_file`, `write_file`, `list_files`
- `store_item`, `list_items`, `delete_item`
- `send_message`, `fetch_url`

**Step 2: Write behavior in prompts** (feature layer)

```markdown
## Content Organization

When asked to organize content:
1. Read existing files to understand the structure
2. Analyze what organization makes sense
3. Create appropriate pages using write_file
4. Use your judgment about layout and formatting

You decide the structure. Make it good.
```

**Step 3: Let the agent work**

Connect prompts + tools and let the agent figure out HOW to achieve the outcome.

**Example with Claude Agent SDK:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

query({
  prompt: userMessage,
  options: {
    systemPrompt,
    mcpServers: { files: fileServer, storage: storageServer },
    permissionMode: "acceptEdits",
  }
});
```

The same pattern works with OpenAI, LangChain, or raw API calls—prompts define outcomes, tools provide capability.
</quick_start>

<reference_index>
## Domain Knowledge

All references in `references/`:

**Architecture:** architecture-patterns.md
**Tool Design:** mcp-tool-design.md
**Prompts:** system-prompt-design.md
**Self-Modification:** self-modification.md
**Refactoring:** refactoring-to-prompt-native.md
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
</anti_patterns>

<success_criteria>
You've built a prompt-native agent when:

- [ ] The agent figures out HOW to achieve outcomes, not just calls your functions
- [ ] Whatever a user could do, the agent can do (no artificial limits)
- [ ] Features are prompts that define outcomes, not code that defines workflows
- [ ] Tools are primitives (read, write, store, call API) that enable capability
- [ ] Changing behavior means editing prose, not refactoring code
- [ ] The agent can surprise you with clever approaches you didn't anticipate
- [ ] You could add a new feature by writing a new prompt section, not new code
</success_criteria>
