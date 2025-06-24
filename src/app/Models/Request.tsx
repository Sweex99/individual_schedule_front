import { Reason } from "./Reason";
import { User } from "./User";

export type Request = {
  id: number;
  state: string;
  student: User;
  reason: Reason
}
  