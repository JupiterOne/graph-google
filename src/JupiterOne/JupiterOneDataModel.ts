import {
  GroupEntity,
  PasswordPolicyEntity,
  UserEntity,
  UserGroupRelationship,
  UserPasswordPolicyRelationship
} from "./Entities";

export default interface JupiterOneDataMoldel {
  groups: GroupEntity[];
  users: UserEntity[];
  passwordPolicies: PasswordPolicyEntity[];
  userGroupRelationships: UserGroupRelationship[];
  userPasswordPolicyRelationships: UserPasswordPolicyRelationship[];
}
