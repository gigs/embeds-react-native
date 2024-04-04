export function assert(
  condition: unknown,
  message: string,
  cause?: Error
): asserts condition {
  if (!condition) {
    throw new Error(message, { cause })
  }
}
