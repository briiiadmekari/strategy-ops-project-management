export interface User {
  id: string;
  name: string;
  email: string;
  org: string;
  role: "superadmin" | "admin" | "member";
}
