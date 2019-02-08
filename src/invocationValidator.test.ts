import invocationValidator from "./invocationValidator";

test("should be implemented to validation invocation", async () => {
  await invocationValidator({} as any);
});
