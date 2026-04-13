export interface User {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "member";
}
