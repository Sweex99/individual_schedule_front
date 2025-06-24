import { Group } from "./Group";

export type UserProfileToken = {
  userName: string;
  email: string;
  token: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  type: string;
  group: Group;
  semester: number;
  gender: string;
  grand_teacher: boolean;
}