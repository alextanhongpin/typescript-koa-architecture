import bunyan from 'bunyan'

export type Logger = bunyan

export function makeLogger(name: string): Logger {
  return bunyan.createLogger({ name })
}
