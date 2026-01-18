type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  requestId?: string
  userId?: string
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  msg: string
  ts: number
  [key: string]: unknown
}

function createLogEntry(level: LogLevel, msg: string, ctx?: LogContext): LogEntry {
  return {
    level,
    msg,
    ts: Date.now(),
    ...ctx,
  }
}

export const log = {
  debug: (msg: string, ctx?: LogContext) =>
    console.debug(JSON.stringify(createLogEntry('debug', msg, ctx))),
  info: (msg: string, ctx?: LogContext) =>
    console.log(JSON.stringify(createLogEntry('info', msg, ctx))),
  warn: (msg: string, ctx?: LogContext) =>
    console.warn(JSON.stringify(createLogEntry('warn', msg, ctx))),
  error: (msg: string, ctx?: LogContext) =>
    console.error(JSON.stringify(createLogEntry('error', msg, ctx))),
}

export function createRequestLogger(baseCtx: LogContext) {
  return {
    debug: (msg: string, ctx?: LogContext) => log.debug(msg, { ...baseCtx, ...ctx }),
    info: (msg: string, ctx?: LogContext) => log.info(msg, { ...baseCtx, ...ctx }),
    warn: (msg: string, ctx?: LogContext) => log.warn(msg, { ...baseCtx, ...ctx }),
    error: (msg: string, ctx?: LogContext) => log.error(msg, { ...baseCtx, ...ctx }),
  }
}

export type Logger = ReturnType<typeof createRequestLogger>
