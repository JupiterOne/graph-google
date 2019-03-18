import GSuiteClient from "./GSuiteClient";

jest.mock("googleapis", () => {
  const Gsuite = require(`${__dirname}/../../test/utils/mockGsuiteApis`);

  const scheme = {
    groups: {
      list: `${__dirname}/../../test/fixtures/badResponse.json`,
    },
    users: {
      list: `${__dirname}/../../test/fixtures/badResponse.json`,
    },
    members: {
      list: `${__dirname}/../../test/fixtures/badResponse.json`,
    },
  };

  return Gsuite.mockGsuiteApis(scheme);
});

jest.mock("google-auth-library");

async function getGsuiteData() {
  const client = new GSuiteClient("fakeId", {
    email: "fake_email",
    key: "fake_key",
    subject: "fake_subject",
  });

  await client.authenticate();

  return client;
}

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
