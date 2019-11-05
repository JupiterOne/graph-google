const mockEndpoints = jest.fn();
jest.doMock("googleapis", () => ({
  google: {
    admin: mockEndpoints,
  },
}));

import readFixture from "../../test/utils/readFixture";
import GSuiteClient from "./GSuiteClient";

jest.mock("google-auth-library");

const mockLogger = {
  error: jest.fn(),
};

async function getGsuiteData() {
  const client = new GSuiteClient(
    "fakeId",
    {
      email: "fake_email",
      key: "fake_key",
      subject: "fake_subject",
    },
    mockLogger as any,
  );

  await client.authenticate();

  return client;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("bad response", () => {
  mockEndpoints.mockReturnValue({
    groups: {
      list: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
    },
    users: {
      list: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
    },
    members: {
      list: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
    },
  });

  test("fetch users with bad response", async () => {
    const client = await getGsuiteData();
    const response = await client.fetchUsers();
    expect(response).toEqual([]);
  });

  test("fetch groups with bad response", async () => {
    const client = await getGsuiteData();
    const response = await client.fetchGroups();
    expect(response).toEqual([]);
  });

  test("fetch members with bad response", async () => {
    const client = await getGsuiteData();
    const response = await client.fetchMembers("gsoupId");
    expect(response).toEqual([]);
  });
});

describe("forbidden", () => {
  mockEndpoints.mockReturnValue({
    groups: {
      list: jest.fn().mockImplementation(() => {
        throw { code: 403, message: "Forbidden" };
      }),
    },
  });

  test.only("fetch groups with forbidden response", async () => {
    const client = await getGsuiteData();
    await expect(client.fetchGroups()).rejects.toMatchObject({ code: 403 });
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });
});
