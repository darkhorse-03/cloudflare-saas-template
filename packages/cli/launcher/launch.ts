import { execSync, spawn } from 'node:child_process'
import type { AgentName } from '../types.js'
import { getAgentCommand } from './detect.js'

/**
 * Launch the selected AI agent in the project directory.
 * Terminal-based agents (claude, codex) replace the current process.
 * GUI-based agents (cursor, windsurf, vscode) open in a new window.
 */
export function launchAgent(agent: AgentName, projectDir: string): void {
  const command = getAgentCommand(agent)

  switch (agent) {
    case 'claude':
    case 'codex': {
      // Terminal agents: spawn with inherited stdio so user can interact
      const child = spawn(command, [], {
        cwd: projectDir,
        stdio: 'inherit',
      })
      child.on('exit', (code) => process.exit(code ?? 0))
      break
    }
    case 'cursor':
    case 'windsurf':
    case 'vscode': {
      // GUI agents: open the directory, then exit CLI
      execSync(`${command} .`, { cwd: projectDir, stdio: 'ignore' })
      break
    }
    default:
      break
  }
}
