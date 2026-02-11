# YAML Frontmatter Schema

**See `.claude/skills/codify-docs/schema.yaml` for the complete schema specification.**

## Required Fields

- **module** (string): Module name (e.g., "Client GUI", "RAG Pipeline") or "System" for system-wide issues
- **date** (string): ISO 8601 date (YYYY-MM-DD)
- **problem_type** (enum): One of [build_error, test_failure, runtime_error, performance_issue, database_issue, security_issue, ui_bug, integration_issue, logic_error, developer_experience, workflow_issue, best_practice, documentation_gap, mcp_tool_issue, edge_function_error, rls_policy_issue, docker_config_issue, agent_prompt_issue, skill_execution_error, env_var_issue, schema_drift, pipeline_failure]
- **component** (enum): One of [react_component, react_hook, react_context, react_page, tanstack_query, supabase_edge_function, supabase_migration, supabase_rls_policy, supabase_rpc, rag_service, mcp_server, mcp_tool, agent_config, skill_prompt, docker_config, docker_compose, ci_workflow, nginx_config, linear_integration, apify_integration, firecrawl_integration, mkdocs_site, knowledge_pipeline, signal_extraction]
- **symptoms** (array): 1-5 specific observable symptoms
- **root_cause** (enum): One of [missing_rls_policy, schema_drift, env_var_missing, env_var_wrong_location, mcp_config_error, docker_network_issue, cors_issue, vite_env_not_in_all_three, edge_function_schema_mismatch, stale_linear_index, alpine_ipv6_resolution, missing_mkdocs_nav_entry, kitchen_sink_commit, worktree_not_isolated, missing_association, missing_index, wrong_api, scope_issue, async_timing, memory_leak, config_error, logic_error, test_isolation, missing_validation, missing_permission, missing_workflow_step, inadequate_documentation, missing_tooling, incomplete_setup]
- **resolution_type** (enum): One of [code_fix, migration, config_change, test_fix, dependency_update, environment_setup, workflow_improvement, documentation_update, tooling_addition, rls_policy_fix, edge_function_fix, docker_config_fix, agent_prompt_fix, skill_update, env_var_fix, schema_alignment, linear_index_refresh, mkdocs_nav_update, claude_md_update]
- **severity** (enum): One of [critical, high, medium, low]

## Optional Fields

- **supabase_table** (string): Supabase table involved (e.g., 'pmm_positioning_anchors')
- **edge_function** (string): Edge Function name (e.g., 'generate-positioning')
- **linear_issue** (string): Linear issue identifier (e.g., 'CF-123')
- **adr_reference** (string): Related ADR (e.g., 'ADR-018')
- **prd_reference** (string): Related PRD (e.g., 'PRD-ONESEC-FIRST-ACCOUNT')
- **related_components** (array): Other components that interact with this issue
- **tags** (array): Searchable keywords (lowercase, hyphen-separated)

## Validation Rules

1. All required fields must be present
2. Enum fields must match allowed values exactly (case-sensitive)
3. symptoms must be YAML array with 1-5 items
4. date must match YYYY-MM-DD format
5. tags should be lowercase, hyphen-separated

## Example

```yaml
---
module: Client GUI
date: 2026-02-10
problem_type: env_var_issue
component: docker_config
symptoms:
  - "VITE_SUPABASE_URL is undefined at runtime in Docker build"
  - "API calls fail silently with empty base URL"
root_cause: vite_env_not_in_all_three
resolution_type: env_var_fix
severity: high
linear_issue: CF-456
tags: [vite, env-var, docker, frontend]
---
```

## Category Mapping

Based on `problem_type`, documentation is filed in:

- **build_error** → `docs/solutions/build-errors/`
- **test_failure** → `docs/solutions/test-failures/`
- **runtime_error** → `docs/solutions/runtime-errors/`
- **performance_issue** → `docs/solutions/performance-issues/`
- **database_issue** → `docs/solutions/database-issues/`
- **security_issue** → `docs/solutions/security-issues/`
- **ui_bug** → `docs/solutions/ui-bugs/`
- **integration_issue** → `docs/solutions/integration-issues/`
- **logic_error** → `docs/solutions/logic-errors/`
- **developer_experience** → `docs/solutions/developer-experience/`
- **workflow_issue** → `docs/solutions/workflow-issues/`
- **best_practice** → `docs/solutions/best-practices/`
- **documentation_gap** → `docs/solutions/documentation-gaps/`
- **mcp_tool_issue** → `docs/solutions/integration-issues/`
- **edge_function_error** → `docs/solutions/runtime-errors/`
- **rls_policy_issue** → `docs/solutions/security-issues/`
- **docker_config_issue** → `docs/solutions/docker-issues/`
- **agent_prompt_issue** → `docs/solutions/agent-issues/`
- **skill_execution_error** → `docs/solutions/agent-issues/`
- **env_var_issue** → `docs/solutions/configuration-issues/`
- **schema_drift** → `docs/solutions/database-issues/`
- **pipeline_failure** → `docs/solutions/runtime-errors/`
