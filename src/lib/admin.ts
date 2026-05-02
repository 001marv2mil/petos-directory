/**
 * Single source of truth for admin emails.
 * Imported by client (Header, AdminPages) and server (api/admin/*).
 *
 * Add a new admin: add their email here, lowercase, and redeploy.
 */
export const ADMIN_EMAILS: readonly string[] = [
  'petosdirectory@gmail.com',
  '001marv2mil@gmail.com',
  'malak@petosdirectory.com',
] as const

/** Is the given email an admin? Case-insensitive. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
