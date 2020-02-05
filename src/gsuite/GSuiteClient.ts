/* eslint-disable @typescript-eslint/camelcase */

import { IntegrationLogger } from "@jupiterone/jupiter-managed-integration-sdk";
import { JWT, JWTOptions } from "google-auth-library";
import { admin_directory_v1, google } from "googleapis";

export enum MemberType {
  CUSTOMER = "CUSTOMER",
  EXTERNAL = "EXTERNAL",
  GROUP = "GROUP",
  USER = "USER",
}

export interface Account {
  id: string;
  name: string;
}

interface UserOrganization {
  title?: string;
  primary?: boolean;
  customType?: string;
  department?: string;
  description?: string;
  costCenter?: string;
}

export interface User extends admin_directory_v1.Schema$User {
  id: string;
  locations?: Location[];
  organizations?: UserOrganization[];
}

export interface Location {
  type?: string;
  area?: string;
  buildingId?: string;
  floorName?: string;
  floorSection?: string;
}

export interface Member extends admin_directory_v1.Schema$Member {
  id: string;
  groupId: string;
  memberType: MemberType;
}

export interface Group extends admin_directory_v1.Schema$Group {
  id: string;
}

export interface Domains {
  domains: string[];
  primaryDomain?: string;
}

export interface GSuiteDataModel {
  groups: Group[];
  users: User[];
  members: Member[];
  domains: Domains;
}

export default class GSuiteClient {
  private client: admin_directory_v1.Admin;
  private accountId: string;
  private credentials: JWTOptions;
  private logger: IntegrationLogger;

  constructor(
    accountId: string,
    credentials: JWTOptions,
    logger: IntegrationLogger,
  ) {
    this.accountId = accountId;
    this.credentials = credentials;
    this.logger = logger;
  }

  public async authenticate(): Promise<void> {
    const auth = new JWT({
      ...this.credentials,
      scopes: [
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/admin.directory.group.readonly",
        "https://www.googleapis.com/auth/admin.directory.domain.readonly",
      ],
    });

    await auth.authorize();

    this.client = google.admin({
      version: "directory_v1",
      auth,
    });
  }

  public async fetchDomains(): Promise<Domains> {
    const domains: Domains = {
      domains: [],
    };

    const response = await this.makeRequest("domains", client =>
      client.domains.list({
        customer: this.accountId,
      }),
    );

    /* istanbul ignore next */
    if (response?.data?.domains) {
      for (const domain of response.data.domains) {
        const domainName = domain.domainName;
        /* istanbul ignore else */
        if (domainName !== undefined) {
          domains.domains.push(domainName);
          /* istanbul ignore else */
          if (domain.isPrimary) {
            domains.primaryDomain = domainName;
          }
        }
      }
    }

    return domains;
  }

  public async fetchGroups(): Promise<Group[]> {
    let groups: Group[] = [];
    let pageToken: string | undefined = "";

    do {
      const response = await this.makeRequest("groups", client =>
        client.groups.list({
          customer: this.accountId,
          pageToken,
        }),
      );

      /* istanbul ignore next */
      if (response?.data?.groups) {
        const pageGroups = response.data.groups as Group[];
        groups = [...groups, ...pageGroups];
        pageToken = response.data.nextPageToken;
      }
    } while (pageToken);

    return groups;
  }

  public async fetchMembers(groupId: string): Promise<Member[]> {
    let members: Member[] = [];
    let pageToken: string | undefined = "";

    do {
      const response = await this.makeRequest("members", client =>
        client.members.list({
          groupKey: groupId,
          pageToken,
        }),
      );

      /* istanbul ignore next */
      if (response?.data?.members) {
        const pageMembers = (response.data
          .members as admin_directory_v1.Schema$Member[]).map(member => ({
          ...member,
          groupId,
          memberType: member.type as MemberType,
          id: member.id as string,
        }));

        members = [...members, ...pageMembers];
        pageToken = response.data.nextPageToken;
      }
    } while (pageToken);

    return members;
  }

  public async fetchUsers(): Promise<User[]> {
    let users: User[] = [];
    let pageToken: string | undefined = "";

    do {
      const response = await this.makeRequest("users", client =>
        client.users.list({
          customer: this.accountId,
          projection: "full",
          pageToken,
        }),
      );

      /* istanbul ignore next */
      if (response?.data?.users) {
        const pageUsers = response.data.users as User[];
        users = [...users, ...pageUsers];
        pageToken = response.data.nextPageToken;
      }
    } while (pageToken);

    return users;
  }

  /* eslint-disable */
  private async makeRequest(
    resource: string,
    doFetch: (client: admin_directory_v1.Admin) => Promise<any>,
  ): Promise<any | undefined> {
    try {
      const result = await doFetch(this.client);
      return result;
    } catch (err) {
      /* istanbul ignore next */
      if (err.code === 403 && err.message?.includes("Not Authorized")) {
        this.logger.warn(err, `fetching ${resource} failed with error`);
      } else {
        throw err;
      }
    }
  }
  /* eslint-enable */
}
