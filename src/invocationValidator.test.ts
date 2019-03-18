import {
  IntegrationInstanceAuthenticationError,
  IntegrationInstanceConfigError,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { readFileSync } from "fs";
import invocationValidator from "./invocationValidator";

import { JWT } from "google-auth-library";

interface Mocked extends jest.Mock, Object {}

function mocked(item: object): Mocked {
  return item as Mocked;
}

jest.mock("google-auth-library", () => {
  return {
    JWT: jest.fn().mockImplementation(() => ({
      authorize() {
        return true;
      },
    })),
    GoogleAuth: jest.fn(),
    DefaultTransporter: jest.fn(),
  };
});

describe("Mocked Google Auth library", () => {
  test("should throw an error for missing serviceAccountCredentials", async () => {
    const executionContext = {
      instance: {
        config: {
          googleAccountId: "example",
          domainAdminEmail: "example@example.com",
        },
      },
      invocationArgs: {},
    };
    try {
      await invocationValidator(executionContext as any);
    } catch (e) {
      expect(e instanceof Error).toBe(true);
    }
    expect.assertions(1);
  });

  test("should throw an error for missing invocationArgs", async () => {
    const executionContext = {
      instance: {
        config: {
          googleAccountId: "example",
          domainAdminEmail: "example@example.com",
        },
      },
    };
    try {
      await invocationValidator(executionContext as any);
    } catch (e) {
      expect(e instanceof Error).toBe(true);
    }
    expect.assertions(1);
  });

  test("should throw an error for missing googleAccountId", async () => {
    jest.doMock("google-auth-library");

    const executionContext = {
      instance: {
        config: {
          domainAdminEmail: "example@example.com",
        },
      },
      invocationArgs: {
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`,
        ).toJSON(),
      },
    };
    try {
      await invocationValidator(executionContext as any);
    } catch (e) {
      expect(e instanceof IntegrationInstanceConfigError).toBe(true);
    }
    expect.assertions(1);
  });

  test("should throw an error for missing domainAdminEmail", async () => {
    const executionContext = {
      instance: {
        config: {
          googleAccountId: "example",
        },
      },
      invocationArgs: {
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`,
        ).toJSON(),
      },
    };
    try {
      await invocationValidator(executionContext as any);
    } catch (e) {
      expect(e instanceof IntegrationInstanceConfigError).toBe(true);
    }
    expect.assertions(1);
  });

  it("should not throw an error for valid config", async () => {
    const executionContext = {
      instance: {
        config: {
          googleAccountId: "example",
          domainAdminEmail: "example@example.com",
        },
      },
      invocationArgs: {
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`,
        ).toJSON(),
      },
    };

    await invocationValidator(executionContext as any);
    expect(invocationValidator(executionContext as any)).resolves.not.toThrow();
  });
});

describe("Unmocked Google Auth library", () => {
  beforeAll(() => {
    mocked(JWT).mockImplementation(() => {
      const googleLib = require.requireActual("google-auth-library");

      return googleLib.JWT;
    });
  });

  it("auth error", async () => {
    const executionContext = {
      instance: {
        config: {
          googleAccountId: "example",
          domainAdminEmail: "example@example.com",
        },
      },
      invocationArgs: {
        serviceAccountCredentials: readFileSync(
          `${__dirname}/../test/fixtures/jwt.json`,
        ).toJSON(),
      },
    };

    try {
      await invocationValidator(executionContext as any);
    } catch (e) {
      expect(e instanceof IntegrationInstanceAuthenticationError).toBe(true);
    }
  });
});
