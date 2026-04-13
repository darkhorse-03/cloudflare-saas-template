import { execSync } from 'node:child_process'
import type { AgentName } from '../types.js'

interface AgentInfo {
  name: AgentName
  command: string
  displayName: string
}

const AGENTS: AgentInfo[] = [
  { name: 'claude', command: 'claude', displayName: 'Claude Code' },
  { name: 'cursor', command: 'cursor', displayName: 'Cursor' },
  { name: 'codex', command: 'codex', displayName: 'Codex' },
  { name: 'windsurf', command: 'windsurf', displayName: 'Windsurf' },
  { name: 'vscode', command: 'code', displayName: 'VS Code (Copilot)' },
]

export function detectAgents(): AgentInfo[] {
  return AGENTS.filter((agent) => {
    try {
      execSync(`which ${agent.command}`, { stdio: 'ignore' })
      return true
    } catch {
      return false
    }
  })
}

export function getAgentDisplayName(name: AgentName): string {
  return AGENTS.find((a) => a.name === name)?.displayName ?? name
}

export function getAgentCommand(name: AgentName): string {
  return AGENTS.find((a) => a.name === name)?.command ?? name
}

export type { AgentInfo }
