import { JWT, JWTOptions } from "google-auth-library";
import { admin_directory_v1, google } from "googleapis";
export interface User extends admin_directory_v1.Schema$User {}

export enum MemberType {
  CUSTOMER = "CUSTOMER",
  EXTERNAL = "EXTERNAL",
  GROUP = "GROUP",
  USER = "USER"
}

export interface Member extends admin_directory_v1.Schema$Member {
  groupId: string;
  memberType: MemberType;
}

export interface MembersDict {
  [groupId: string]: Member[];
}

export interface Group extends admin_directory_v1.Schema$Group {}

export interface GSuiteDataModel {
  groups: Group[];
  users: User[];
  members: Member[];
}

export default class GSuiteClient {
  private client: admin_directory_v1.Admin;
  private accountId: string;
  private credentials: JWTOptions;

  constructor(accountId: string, credentials: JWTOptions) {
    this.accountId = accountId;
    this.credentials = credentials;
  }

  public async authenticate() {
    const auth = new JWT({
      ...this.credentials,
      scopes: [
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/admin.directory.group.readonly",
        "https://www.googleapis.com/auth/admin.directory.domain.readonly"
      ]
    });

    await auth.authorize();

    this.client = google.admin({
      version: "directory_v1",
      auth
    });
  }

  public async fetchGroups(): Promise<Group[]> {
    const result = await this.client.groups.list({
      customer: this.accountId
    });

    if (!result.data || !result.data.groups) {
      return [];
    }

    return result.data.groups;
  }

  public async fetchMembers(groupId: string): Promise<Member[]> {
    const result = await this.client.members.list({
      groupKey: groupId
    });

    if (!result.data || !result.data.members) {
      return [];
    }

    return result.data.members.map(member => ({
      ...member,
      groupId,
      memberType: member.type as MemberType
    }));
  }

  public async fetchUsers(): Promise<User[]> {
    const result = await this.client.users.list({
      customer: this.accountId
    });

    if (!result.data || !result.data.users) {
      return [];
    }

    return result.data.users;
  }
}
