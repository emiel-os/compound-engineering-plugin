import { defineCommand } from "citty"
import path from "path"
import { loadClaudePlugin } from "../parsers/claude"
import { targets } from "../targets"
import { pathExists } from "../utils/files"
import type { PermissionMode } from "../converters/claude-to-opencode"

const permissionModes: PermissionMode[] = ["none", "broad", "from-commands"]

export default defineCommand({
  meta: {
    name: "install",
    description: "Install and convert a local Claude plugin",
  },
  args: {
    plugin: {
      type: "positional",
      required: true,
      description: "Plugin name (from plugins/) or a path",
    },
    to: {
      type: "string",
      default: "opencode",
      description: "Target format (opencode | codex)",
    },
    output: {
      type: "string",
      alias: "o",
      default: ".",
      description: "Output directory (project root)",
    },
    also: {
      type: "string",
      description: "Comma-separated extra targets to generate (ex: codex)",
    },
    permissions: {
      type: "string",
      default: "broad",
      description: "Permission mapping: none | broad | from-commands",
    },
    agentMode: {
      type: "string",
      default: "subagent",
      description: "Default agent mode: primary | subagent",
    },
    inferTemperature: {
      type: "boolean",
      default: true,
      description: "Infer agent temperature from name/description",
    },
  },
  async run({ args }) {
    const targetName = String(args.to)
    const target = targets[targetName]
    if (!target) {
      throw new Error(`Unknown target: ${targetName}`)
    }
    if (!target.implemented) {
      throw new Error(`Target ${targetName} is registered but not implemented yet.`)
    }

    const permissions = String(args.permissions)
    if (!permissionModes.includes(permissions as PermissionMode)) {
      throw new Error(`Unknown permissions mode: ${permissions}`)
    }

    const pluginPath = await resolvePluginPath(String(args.plugin))
    const plugin = await loadClaudePlugin(pluginPath)
    const outputRoot = path.resolve(String(args.output))

    const options = {
      agentMode: String(args.agentMode) === "primary" ? "primary" : "subagent",
      inferTemperature: Boolean(args.inferTemperature),
      permissions: permissions as PermissionMode,
    }

    const bundle = target.convert(plugin, options)
    if (!bundle) {
      throw new Error(`Target ${targetName} did not return a bundle.`)
    }
    await target.write(outputRoot, bundle)
    console.log(`Installed ${plugin.manifest.name} to ${outputRoot}`)

    const extraTargets = parseExtraTargets(args.also)
    for (const extra of extraTargets) {
      const handler = targets[extra]
      if (!handler) {
        console.warn(`Skipping unknown target: ${extra}`)
        continue
      }
      if (!handler.implemented) {
        console.warn(`Skipping ${extra}: not implemented yet.`)
        continue
      }
      const extraBundle = handler.convert(plugin, options)
      if (!extraBundle) {
        console.warn(`Skipping ${extra}: no output returned.`)
        continue
      }
      const extraRoot = path.join(outputRoot, extra)
      await handler.write(extraRoot, extraBundle)
      console.log(`Installed ${plugin.manifest.name} to ${extraRoot}`)
    }
  },
})

async function resolvePluginPath(input: string): Promise<string> {
  const directPath = path.resolve(input)
  if (await pathExists(directPath)) return directPath

  const pluginsPath = path.join(process.cwd(), "plugins", input)
  if (await pathExists(pluginsPath)) return pluginsPath

  throw new Error(`Could not find plugin at ${input}`)
}

function parseExtraTargets(value: unknown): string[] {
  if (!value) return []
  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}
