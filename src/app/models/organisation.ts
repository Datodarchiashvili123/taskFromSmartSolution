import { Role } from "./role";

export interface Organisation{
  id?: number,
  organisationName:string,
  phoneNumber: string,
  address: string,
  username: string,
  name: string,
  surname: string,
  email: string,
  password: string,
  userType: Role,
}
