import { Group, Member, User } from "./GSuiteClient";

export default interface GSuiteDataModel {
  groups: Group[];
  users: User[];
  members: Member[];
}
