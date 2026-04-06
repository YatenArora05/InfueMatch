/** Header the admin SPA sends after login (see admin-login page). */
export const ADMIN_SESSION_HEADER = "x-admin-id";

export function getExpectedAdminSessionId(): string {
  return (process.env.ADMIN_SESSION_ID || "admin-temp-id").trim();
}

export function isAdminRequest(req: Request): boolean {
  const id = req.headers.get(ADMIN_SESSION_HEADER);
  return id === getExpectedAdminSessionId();
}
