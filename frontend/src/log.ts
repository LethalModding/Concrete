import { LogError } from '@/../wailsjs/runtime/runtime.js'

/**
 * Terminal handler for a promise nothing awaits. The Wails runtime log is the
 * only error surface this app has; there is no toast or notification system.
 */
export const logRejection = (reason: unknown): void => {
  LogError(reason instanceof Error ? reason.message : String(reason))
}
