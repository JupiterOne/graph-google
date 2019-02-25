import { IntegrationInstanceConfigError } from "@jupiterone/jupiter-managed-integration-sdk";
import { readFileSync } from "fs";
import invocationValidator from "./invocationValidator";

jest.mock("google-auth-library");

test("should throw an error for missing serviceAccountCredentials", async () => {
  const executionContext = {
    instance: {
      config: {
        googleAccountId: "example",
        domainAdminEmail: "example@example.com"
      }
    }
  };
  try {
    await invocationValidator(executionContext as any);
  } catch (e) {
    expect(e instanceof Error).toBe(true);
  }
});

test("should throw an error for missing googleAccountId", async () => {
  const executionContext = {
    instance: {
      config: {
        domainAdminEmail: "example@example.com",
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`
        ).toJSON()
      }
    }
  };
  try {
    await invocationValidator(executionContext as any);
  } catch (e) {
    expect(e instanceof IntegrationInstanceConfigError).toBe(true);
  }
});

test("should throw an error for missing domainAdminEmail", async () => {
  const executionContext = {
    instance: {
      config: {
        googleAccountId: "example",
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`
        ).toJSON()
      }
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
        googleAccountId: "example",
        domainAdminEmail: "example@example.com",
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`
        ).toJSON()
      }
    }
  };

  expect(invocationValidator(executionContext as any)).resolves.not.toThrow();
});
