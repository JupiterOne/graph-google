import { IntegrationLogger } from "@jupiterone/jupiter-managed-integration-sdk";
import { GaxiosResponse } from "gaxios";
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

  public async authenticate() {
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
    return this.fetchWithLog("domains", async () => {
      const domains: Domains = {
        domains: [],
      };

      const result = (await this.client.domains.list({
        customer: this.accountId,
      })) as GaxiosResponse<admin_directory_v1.Schema$Domains2>;

      if (result.data && result.data.domains) {
        for (const domain of result.data.domains) {
          const domainName = domain.domainName;
          if (domainName !== undefined) {
            domains.domains.push(domainName);
            if (domain.isPrimary) {
              domains.primaryDomain = domainName;
            }
          }
        }
      }

      return domains;
    });
  }

  public async fetchGroups(): Promise<Group[]> {
    return this.fetchWithLog("groups", async () => {
      let groups: Group[] = [];
      let pageToken: string | undefined = "";

      do {
        const result = (await this.client.groups.list({
          customer: this.accountId,
          pageToken,
        })) as GaxiosResponse<admin_directory_v1.Schema$Groups>;

        if (result.data && result.data.groups) {
          const pageGroups = result.data.groups as Group[];
          groups = [...groups, ...pageGroups];
          pageToken = result.data.nextPageToken;
        }
      } while (pageToken);

      return groups;
    });
  }

  public async fetchMembers(groupId: string): Promise<Member[]> {
    return this.fetchWithLog("members", async () => {
      let members: Member[] = [];
      let pageToken: string | undefined = "";

      do {
        const result = (await this.client.members.list({
          groupKey: groupId,
          pageToken,
        })) as GaxiosResponse<admin_directory_v1.Schema$Members>;

        if (result.data && result.data.members) {
          const pageMembers = result.data.members.map(member => ({
            ...member,
            groupId,
            memberType: member.type as MemberType,
            id: member.id as string,
          }));

          members = [...members, ...pageMembers];
          pageToken = result.data.nextPageToken;
        }
      } while (pageToken);

      return members;
    });
  }

  public async fetchUsers(): Promise<User[]> {
    return this.fetchWithLog("users", async () => {
      let users: User[] = [];
      let pageToken: string | undefined = "";

      do {
        const result = (await this.client.users.list({
          customer: this.accountId,
          projection: "full",
          pageToken,
        })) as GaxiosResponse<admin_directory_v1.Schema$Users>;

        if (result.data && result.data.users) {
          const pageUsers = result.data.users as User[];
          users = [...users, ...pageUsers];
          pageToken = result.data.nextPageToken;
        }
      } while (pageToken);

      return users;
    });
  }

  private async fetchWithLog<Return>(
    resource: string,
    doFetch: () => Promise<Return>,
  ): Promise<Return> {
    try {
      return doFetch();
    } catch (err) {
      this.logger.error(err, `fetching ${resource} failed with error`);
      throw err;
    }
  }
}
