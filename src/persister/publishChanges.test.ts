import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import fetchGsuiteData from "../gsuite/fetchGsuiteData";
import initializeContext from "../initializeContext";

import { readFileSync } from "fs";
import { convert } from "./publishChanges";

jest.mock("googleapis", () => {
  const Gsuite = require(`${__dirname}/../../test/utils/mockGsuiteApis`);

  const scheme = {
    groups: {
      list: `${__dirname}/../../test/fixtures/groups.json`,
    },
    users: {
      list: `${__dirname}/../../test/fixtures/users.json`,
    },
    members: {
      list: `${__dirname}/../../test/fixtures/members.json`,
    },
    domains: {
      list: `${__dirname}/../../test/fixtures/domains.json`,
    },
  };

  return Gsuite.mockGsuiteApis(scheme);
});

jest.mock("google-auth-library");

async function initialize() {
  const options = {
    instance: {
      config: {
        googleAccountId: "fakeId",
      },
      id: "",
      name: "google_account_name",
    },
    invocationArgs: {
      serviceAccountCredentials: readFileSync(
        `${__dirname}/../../test/fixtures/jwt.json`,
      ).toJSON(),
    },
  };

  const context = {
    ...createTestIntegrationExecutionContext(options),
    invocationArgs: options.invocationArgs,
  };

  return initializeContext(context);
}

test("Convert Groups", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.entities.groups).toEqual([
    {
      _class: "UserGroup",
      _key: "google_group_1",
      _type: "google_group",
      adminCreated: true,
      description: "",
      directMembersCount: "1",
      displayName: "Restircted Test Group",
      email: "restricted.test1@example.com",
      id: "1",
      kind: "admin#directory#group",
      name: "Restircted Test Group",
    },
    {
      _class: "UserGroup",
      _key: "google_group_2",
      _type: "google_group",
      adminCreated: true,
      description: "",
      directMembersCount: "2",
      displayName: "Team Test Group",
      email: "team.test.group@example.com",
      id: "2",
      kind: "admin#directory#group",
      name: "Team Test Group",
    },
    {
      _class: "UserGroup",
      _key: "google_group_",
      _type: "google_group",
      adminCreated: true,
      description: "",
      directMembersCount: "0",
      displayName: "Empty Test Group",
      email: "restricted.test1@example.com",
      id: "",
      kind: "admin#directory#group",
      name: "Empty Test Group",
    },
  ]);
});

test("Convert Users", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.entities.users).toEqual([
    {
      _class: "User",
      _key: "google_user_3",
      _type: "google_user",
      active: true,
      agreedToTerms: true,
      aliases: ["fakeName1@example.com", "fakeFamilyName1@example.com"],
      archived: false,
      costCenter: "Cost Center",
      changePasswordAtNextLogin: false,
      creationTime: 1548697352000,
      customerId: "fakeID",
      customType: "",
      displayName: "fakeName fakeFamilyName",
      deletionTime: undefined,
      department: "Customer Relationship",
      email: "first.user@example.com",
      employeeType: "Developer",
      firstName: "fakeName",
      managerEmail: "manager@example.com",
      homeAddress: "Sample Streeet Samle country, 0000132",
      homePhone: "79298282828282",
      hashFunction: undefined,
      id: "3",
      includeInGlobalAddressList: true,
      ipWhitelisted: false,
      isAdmin: true,
      isDelegatedAdmin: false,
      recoveryEmail: undefined,
      recoveryPhone: undefined,
      suspensionReason: undefined,
      thumbnailPhotoEtag: undefined,
      thumbnailPhotoUrl: undefined,
      title: "Team Lead",
      username: "first.user",
      isEnforcedIn2Sv: false,
      isEnrolledIn2Sv: false,
      isMailboxSetup: true,
      kind: "admin#directory#user",
      lastLoginTime: 1549971753000,
      lastName: "fakeFamilyName",
      managerRelation: "manager@example.com",
      mfaEnabled: false,
      orgUnitPath: "/",
      organizationExternalId: "123",
      primaryEmail: "first.user@example.com",
      suspended: false,
      workAddress: "Sample Streeet Samle country, 000000",
      workEmail: "first.user@dualbootpartners.com",
      workPhone: "3123123",
    },
    {
      _class: "User",
      _key: "google_user_4",
      _type: "google_user",
      active: true,
      agreedToTerms: true,
      archived: true,
      changePasswordAtNextLogin: false,
      creationTime: 1548696732000,
      customerId: "fakeID",
      displayName: "FakeName2 FakeFamilyName2",
      email: "fake.user2@example.com",
      firstName: "FakeName2",
      aliases: undefined,
      id: "4",
      includeInGlobalAddressList: true,
      deletionTime: undefined,
      ipWhitelisted: false,
      hashFunction: undefined,
      isAdmin: true,
      isDelegatedAdmin: false,
      isEnforcedIn2Sv: true,
      isEnrolledIn2Sv: false,
      isMailboxSetup: true,
      kind: "admin#directory#user",
      lastLoginTime: 1548848642000,
      lastName: "FakeFamilyName2",
      mfaEnabled: false,
      orgUnitPath: "/",
      primaryEmail: "fake.user2@example.com",
      recoveryEmail: undefined,
      recoveryPhone: undefined,
      suspended: false,
      suspensionReason: undefined,
      thumbnailPhotoEtag: undefined,
      thumbnailPhotoUrl: undefined,
      username: "fake.user2",
    },
    {
      _class: "User",
      _key: "google_user_5",
      _type: "google_user",
      active: true,
      agreedToTerms: true,
      aliases: undefined,
      archived: false,
      changePasswordAtNextLogin: true,
      creationTime: 1548861622000,
      customerId: "fakeID",
      deletionTime: undefined,
      displayName: "Test user",
      email: "test@example.com",
      firstName: "Test",
      hashFunction: undefined,
      id: "5",
      includeInGlobalAddressList: true,
      ipWhitelisted: false,
      isAdmin: false,
      isDelegatedAdmin: false,
      isEnforcedIn2Sv: false,
      isEnrolledIn2Sv: true,
      isMailboxSetup: true,
      kind: "admin#directory#user",
      lastLoginTime: 0,
      lastName: "user",
      mfaEnabled: false,
      orgUnitPath: "/",
      primaryEmail: "test@example.com",
      recoveryEmail: undefined,
      recoveryPhone: undefined,
      suspended: true,
      suspensionReason: undefined,
      thumbnailPhotoEtag: undefined,
      thumbnailPhotoUrl: undefined,
      username: "test",
    },
    {
      _class: "User",
      _key: "google_user_6",
      _type: "google_user",
      active: true,
      agreedToTerms: true,
      aliases: undefined,
      archived: false,
      changePasswordAtNextLogin: true,
      creationTime: 1548861622000,
      customerId: "fakeID",
      deletionTime: undefined,
      displayName: "",
      email: "test1@example.com",
      firstName: null,
      hashFunction: undefined,
      id: "6",
      includeInGlobalAddressList: true,
      ipWhitelisted: false,
      isAdmin: false,
      isDelegatedAdmin: false,
      isEnforcedIn2Sv: true,
      isEnrolledIn2Sv: true,
      isMailboxSetup: true,
      kind: "admin#directory#user",
      lastLoginTime: 0,
      lastName: null,
      mfaEnabled: true,
      orgUnitPath: "/",
      primaryEmail: "test1@example.com",
      recoveryEmail: undefined,
      recoveryPhone: undefined,
      suspended: false,
      suspensionReason: undefined,
      thumbnailPhotoEtag: undefined,
      thumbnailPhotoUrl: undefined,
      username: "test1",
    },
  ]);
});

test("Convert Users -> Group Relationships", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.relationships.userGroupRelationships).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "google_group_1",
      _key: "google_group_1_has_google_user_3",
      _type: "google_group_has_user",
      _toEntityKey: "google_user_3",
      deliverySettings: undefined,
      email: "first.user@example.com",
      id: "3",
      kind: "admin#directory#member",
      role: "MANAGER",
      status: "ACTIVE",
      type: "USER",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_1",
      _key: "google_group_1_has_google_user_6",
      _type: "google_group_has_user",
      _toEntityKey: "google_user_6",
      deliverySettings: undefined,
      email: "test@example.com",
      id: "5",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "USER",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_1",
      _key: "google_group_1_has_google_group_1",
      _type: "google_group_has_user",
      _toEntityKey: "google_group_1",
      deliverySettings: undefined,
      email: "restricted.test@example.com",
      id: "104221518650717901111",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "GROUP",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_1",
      _key: "google_group_1_has_google_group_2",
      _type: "google_group_has_user",
      _toEntityKey: "google_group_2",
      deliverySettings: undefined,
      email: "team.test.group@example.com",
      id: "104221518650717901222",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "GROUP",
    },
    {
      _class: "HAS",
      _key: "google_group_1_has_user_example@other-gsuite-domain.com",
      _mapping: {
        relationshipDirection: "FORWARD",
        skipTargetCreation: false,
        sourceEntityKey: "google_group_1",
        targetEntity: {
          _class: "User",
          email: "example@other-gsuite-domain.com",
        },
        targetFilterKeys: [["_class", "email"]],
      },
      _type: "google_group_has_user",
    },
    {
      _class: "HAS",
      _key: "google_group_1_has_group_group1@other-gsuite-domain.com",
      _mapping: {
        relationshipDirection: "FORWARD",
        skipTargetCreation: false,
        sourceEntityKey: "google_group_1",
        targetEntity: {
          _class: "UserGroup",
          email: "group1@other-gsuite-domain.com",
        },
        targetFilterKeys: [["_class", "email"]],
      },
      _type: "google_group_has_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_2",
      _key: "google_group_2_has_google_user_3",
      _type: "google_group_has_user",
      _toEntityKey: "google_user_3",
      deliverySettings: undefined,
      email: "first.user@example.com",
      id: "3",
      kind: "admin#directory#member",
      role: "MANAGER",
      status: "ACTIVE",
      type: "USER",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_2",
      _key: "google_group_2_has_google_user_6",
      _type: "google_group_has_user",
      _toEntityKey: "google_user_6",
      deliverySettings: undefined,
      email: "test@example.com",
      id: "5",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "USER",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_2",
      _key: "google_group_2_has_google_group_1",
      _type: "google_group_has_user",
      _toEntityKey: "google_group_1",
      deliverySettings: undefined,
      email: "restricted.test@example.com",
      id: "104221518650717901111",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "GROUP",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_group_2",
      _key: "google_group_2_has_google_group_2",
      _type: "google_group_has_user",
      _toEntityKey: "google_group_2",
      deliverySettings: undefined,
      email: "team.test.group@example.com",
      id: "104221518650717901222",
      kind: "admin#directory#member",
      role: "MEMBER",
      status: "ACTIVE",
      type: "GROUP",
    },
    {
      _class: "HAS",
      _key: "google_group_2_has_user_example@other-gsuite-domain.com",
      _mapping: {
        relationshipDirection: "FORWARD",
        skipTargetCreation: false,
        sourceEntityKey: "google_group_2",
        targetEntity: {
          _class: "User",
          email: "example@other-gsuite-domain.com",
        },
        targetFilterKeys: [["_class", "email"]],
      },
      _type: "google_group_has_user",
    },
    {
      _class: "HAS",
      _key: "google_group_2_has_group_group1@other-gsuite-domain.com",
      _mapping: {
        relationshipDirection: "FORWARD",
        skipTargetCreation: false,
        sourceEntityKey: "google_group_2",
        targetEntity: {
          _class: "UserGroup",
          email: "group1@other-gsuite-domain.com",
        },
        targetFilterKeys: [["_class", "email"]],
      },
      _type: "google_group_has_user",
    },
  ]);
});

test("Convert Sites", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.entities.sites).toEqual([
    {
      _class: "Site",
      _key: "google_site_3_123",
      _type: "google_site",
      area: "desk",
      buildingId: "123",
      displayName: "123, 3, 2",
      floorName: "3",
      floorSection: "2",
      id: "123",
      type: "desk",
    },
  ]);
});

test("Convert User -> Site Relationships", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.relationships.siteUserRelationships).toEqual([
    {
      _class: "HOSTS",
      _fromEntityKey: "google_site_3_123",
      _key: "google_site_3_123_hosts_google_user_3",
      _toEntityKey: "google_user_3",
      _type: "google_site_hosts_user",
    },
  ]);
});

test("Convert Account", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.entities.accounts).toEqual([
    {
      _key: "google_account_fakeId",
      _type: "google_account",
      _class: "Account",
      displayName: "google_account_name",
      name: "google_account_name",
      domains: ["test.com"],
      primaryDomain: "test.com",
      accountId: "test.com",
      id: "fakeId",
    },
  ]);
});

test("Convert Account -> User Relationships", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.relationships.accountUserRelationships).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_user_3",
      _toEntityKey: "google_user_3",
      _type: "google_account_has_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_user_4",
      _toEntityKey: "google_user_4",
      _type: "google_account_has_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_user_5",
      _toEntityKey: "google_user_5",
      _type: "google_account_has_user",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_user_6",
      _toEntityKey: "google_user_6",
      _type: "google_account_has_user",
    },
  ]);
});

test("Convert Account -> Group Relationships", async () => {
  const { provider, account } = await initialize();
  const newData = convert(await fetchGsuiteData(provider), account);

  expect(newData.relationships.accountGroupRelationships).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_group_1",
      _toEntityKey: "google_group_1",
      _type: "google_account_has_group",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_group_2",
      _toEntityKey: "google_group_2",
      _type: "google_account_has_group",
    },
    {
      _class: "HAS",
      _fromEntityKey: "google_account_fakeId",
      _key: "google_account_fakeId_has_google_group_",
      _toEntityKey: "google_group_",
      _type: "google_account_has_group",
    },
  ]);
});
