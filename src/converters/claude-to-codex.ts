import { formatFrontmatter } from "../utils/frontmatter"
import type { ClaudeAgent, ClaudeCommand, ClaudePlugin } from "../types/claude"
import type { CodexBundle, CodexGeneratedSkill, CodexPrompt } from "../types/codex"
import type { ClaudeToOpenCodeOptions } from "./claude-to-opencode"

export type ClaudeToCodexOptions = ClaudeToOpenCodeOptions

export function convertClaudeToCodex(
  plugin: ClaudePlugin,
  _options: ClaudeToCodexOptions,
): CodexBundle {
  const promptNames = new Set<string>()
  const prompts = plugin.commands.map((command) => convertCommand(command, promptNames))

  const skillDirs = plugin.skills.map((skill) => ({
    name: skill.name,
    sourceDir: skill.sourceDir,
  }))

  const existingSkillNames = new Set<string>(skillDirs.map((skill) => normalizeName(skill.name)))
  const generatedSkills = plugin.agents.map((agent) => convertAgent(agent, existingSkillNames))

  return {
    prompts,
    skillDirs,
    generatedSkills,
    mcpServers: plugin.mcpServers,
  }
}

function convertCommand(command: ClaudeCommand, usedNames: Set<string>): CodexPrompt {
  const name = uniqueName(normalizeName(command.name), usedNames)
  const frontmatter: Record<string, unknown> = {
    description: command.description,
    "argument-hint": command.argumentHint,
  }
  const content = formatFrontmatter(frontmatter, command.body)
  return { name, content }
}

function convertAgent(agent: ClaudeAgent, usedNames: Set<string>): CodexGeneratedSkill {
  const name = uniqueName(normalizeName(agent.name), usedNames)
  const description = agent.description ?? `Converted from Claude agent ${agent.name}`
  const frontmatter: Record<string, unknown> = { name, description }

  let body = agent.body.trim()
  if (agent.capabilities && agent.capabilities.length > 0) {
    const capabilities = agent.capabilities.map((capability) => `- ${capability}`).join("\n")
    body = `## Capabilities\n${capabilities}\n\n${body}`.trim()
  }
  if (body.length === 0) {
    body = `Instructions converted from the ${agent.name} agent.`
  }

  const content = formatFrontmatter(frontmatter, body)
  return { name, content }
}

function normalizeName(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return "item"
  const normalized = trimmed
    .toLowerCase()
    .replace(/[\\/]+/g, "-")
    .replace(/[:\s]+/g, "-")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
  return normalized || "item"
}

function uniqueName(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base)
    return base
  }
  let index = 2
  while (used.has(`${base}-${index}`)) {
    index += 1
  }
  const name = `${base}-${index}`
  used.add(name)
  return name
}
