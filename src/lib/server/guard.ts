// Server-only runtime check
export function ensureServerOnly(contextName: string): void {
  if (typeof window !== "undefined") {
    throw new Error(
      `[Security Guard] Forbidden: "${contextName}" is a server-only module and must never be executed or imported on the client side.`
    );
  }
}
