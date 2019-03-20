export default function setCollectionAsFlattenFields<T>(
  entity: T,
  postfix: string,
  colleciton: any[],
  valueMethod: string,
): T {
  const e = entity as any;

  colleciton.forEach(item => {
    e[`${item.type}${postfix}`] = item[valueMethod];
  });

  return e;
}
