import { JWT, JWTOptions } from "google-auth-library";
import { admin_directory_v1, google } from "googleapis";
import { flatten } from "ramda";
import GSuiteDataModel from "./GSuiteDataModel";

export interface User extends admin_directory_v1.Schema$User {}
export enum MemberType {
  USER,
  GROUP
}
export interface Member extends admin_directory_v1.Schema$Member {
  groupId: string;
  isUser: boolean;
  isGroup: boolean;
}
export interface Group extends admin_directory_v1.Schema$Group {}

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

  public async fetchEntities(): Promise<GSuiteDataModel> {
    const [users, groups] = await Promise.all([
      this.fetchUsers(),
      this.fetchGroups()
    ]);

    const members = await Promise.all(
      groups.map(group => this.fetchMembers(group.id))
    );

    return { users, groups, members: flatten(members) };
  }

  public async fetchGroups(): Promise<Group[]> {
    const result = await this.client.groups.list({
      customer: this.accountId
    });

    if (!result.data || !result.data.groups) {
      return [];
    }

    return result.data.groups as Group[];
  }

  public async fetchMembers(groupId?: string): Promise<Member[]> {
    if (!groupId) {
      return [];
    }

    const result = await this.client.members.list({
      groupKey: groupId
    });

    if (!result.data || !result.data.members) {
      return [];
    }

    return result.data.members.map(
      member =>
        ({
          ...member,
          groupId,
          isGroup: member.type === MemberType.GROUP.toString(),
          isUser: member.type === MemberType.USER.toString()
        } as Member)
    ) as Member[];
  }

  public async fetchUsers(): Promise<User[]> {
    const result = await this.client.users.list({
      customer: this.accountId
    });

    if (!result.data || !result.data.users) {
      return [];
    }

    return result.data.users as User[];
  }
}
