import { Role } from "../vos/Role";
import { Email } from "../vos/Email";

export interface User {
  email: Email;
  password: string;
  role: Role;
}