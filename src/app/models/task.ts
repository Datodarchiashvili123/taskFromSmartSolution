import { Status } from "./status";

export interface Task{
  id: number ,
  organisationId: number,
  title: string,
  description: string,
  deadline: string,
  userId: number,
  status: Status
}

export interface TaskUser extends Task{
  username: string;
}
