import { IntegrationInstanceConfigError } from "@jupiterone/jupiter-managed-integration-sdk";
import { readFileSync } from "fs";
import invocationValidator from "./invocationValidator";

jest.mock("google-auth-library");

test("should throw a error for invalid config", async () => {
  const executionContext = {
    instance: {
      config: {}
    }
  };
  try {
    await invocationValidator(executionContext as any);
  } catch (e) {
    expect(e instanceof IntegrationInstanceConfigError).toBe(true);
  }
});

it("should not throw a error for valid config", async () => {
  const executionContext = {
    instance: {
      config: {
        accountId: "example",
        creds: readFileSync(
          `${__dirname}/..//test/fixtures/jwt.json`
        ).toString(),
        subject: "exaple@example.com"
      }
    }
  };

  expect(invocationValidator(executionContext as any)).resolves.not.toThrow();
});
