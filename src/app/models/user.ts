import { Role } from "./role";

export interface User {
  id: number;
  taskId?: number
  email: string;
  password: string;
  passwordConfirm?:string;
  userType: Role;
  token?: string;
  organisationId: number;
  name: string;
  username: string;
  surname: string;
}

export interface PreRegistrationUser{
  email: string;
}
