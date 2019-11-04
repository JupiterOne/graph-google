import GSuiteClient, { GSuiteDataModel } from "./GSuiteClient";

export default async function fetchGsuiteData(
  client: GSuiteClient,
): Promise<GSuiteDataModel> {
  const [users, groups, domains] = await Promise.all([
    client.fetchUsers(),
    client.fetchGroups(),
    client.fetchDomains(),
  ]);

  const groupsMembers = await Promise.all(
    groups.map(group => {
      return group.id ? client.fetchMembers(group.id) : [];
    }),
  );

  const allMembers = groupsMembers.reduce((acc, value) => {
    return acc.concat(value);
  }, []);

  return { users, groups, members: allMembers, domains };
}
