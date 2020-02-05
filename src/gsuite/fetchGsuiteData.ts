import GSuiteClient, { GSuiteDataModel, Member } from "./GSuiteClient";

export default async function fetchGsuiteData(
  client: GSuiteClient,
): Promise<GSuiteDataModel> {
  const users = await client.fetchUsers();
  const groups = await client.fetchGroups();
  const domains = await client.fetchDomains();

  let members: Member[] = [];
  for (const group of groups) {
    if (group.id) {
      const groupMembers = await client.fetchMembers(group.id);
      members = [...members, ...groupMembers];
    }
  }

  return { users, groups, members, domains };
}
