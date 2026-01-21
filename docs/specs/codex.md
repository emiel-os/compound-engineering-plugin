# Codex Spec (Config, Prompts, Skills, MCP)

Last verified: 2026-01-21

## Primary sources

```
https://developers.openai.com/codex/local-config
https://developers.openai.com/codex/config-advanced
https://developers.openai.com/codex/custom-prompts
https://developers.openai.com/codex/cli/slash-commands
https://developers.openai.com/codex/skills
https://developers.openai.com/codex/skills/create-skill
https://developers.openai.com/codex/guides/agents-md
https://developers.openai.com/codex/mcp
```

## Config location and precedence

- Codex reads configuration from `~/.codex/config.toml`, and the CLI + IDE extension share the same file. citeturn2search2turn2search0
- `CODEX_HOME` controls where Codex stores its home directory (defaults to `~/.codex`), including `config.toml`. citeturn2search1turn3search1
- Configuration precedence is CLI flags → profile values → root-level `config.toml` → built-in defaults. citeturn2search2

## Custom prompts (slash commands)

- Custom prompts are Markdown files in `~/.codex/prompts/`, and Codex scans only top-level Markdown files in that directory. citeturn1search0turn1search1
- Prompts are invoked explicitly as `/prompts:<name>` and are not shared through the repository; skills are the shareable mechanism. citeturn1search0turn1search1
- Prompt front matter supports `description:` and `argument-hint:` to document usage and arguments. citeturn1search0turn1search1

## Skills (agent skills)

- A skill is a folder containing a required `SKILL.md` file plus optional `scripts/`, `references/`, and `assets/` directories. citeturn1search2turn3search5
- `SKILL.md` must include `name` and `description` in YAML front matter; additional metadata is optional. citeturn1search2turn1search3
- Skills can be stored user-scoped at `~/.codex/skills/<skill-name>` or repo-scoped at `.codex/skills/<skill-name>`. citeturn1search3
- Codex loads only the skill name and description until the skill is explicitly invoked. citeturn1search3

## AGENTS.md instructions

- Codex reads `AGENTS.md` files before work starts and builds a combined instruction chain from global + project guidance. citeturn3search1
- Global guidance lives under `~/.codex` (or `CODEX_HOME`), using `AGENTS.override.md` before `AGENTS.md`. citeturn3search1
- Project guidance is discovered from the repo root down to the current directory, preferring `AGENTS.override.md` then `AGENTS.md`, and concatenating files in order. citeturn3search1
- Instruction discovery is bounded by `project_doc_max_bytes`, and fallback filenames can be added via `project_doc_fallback_filenames`. citeturn3search1

## MCP (Model Context Protocol)

- MCP server configuration lives in `~/.codex/config.toml` and is shared across the CLI and IDE extension. citeturn2search0turn2search2
- Each server is configured under `[mcp_servers.<server-name>]`. citeturn2search0
- STDIO servers use `command` (required) with optional `args`, `env`, `env_vars`, and `cwd`. citeturn2search0
- Streamable HTTP servers use `url` (required) with optional `bearer_token_env_var`, `http_headers`, and `env_http_headers`. citeturn2search0
- Optional server settings include `startup_timeout_sec`, `tool_timeout_sec`, `enabled`, `enabled_tools`, and `disabled_tools`. citeturn2search0
