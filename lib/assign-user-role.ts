export type UserRole = "admin" | "regular";

const ADMIN_EMAILS = process.env
  .ADMIN_EMAILS!.split(",")
  .map((email) => email.trim().toLowerCase());

export function assignUserRole(email: string): UserRole {
  return ADMIN_EMAILS.includes(email) ? "admin" : "regular";
}
