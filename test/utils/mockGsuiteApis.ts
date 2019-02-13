import { readFileSync } from "fs";

export interface ApiEndpoint {
  [methodName: string]: string;
}

export interface ApiEndpoints {
  [endponitName: string]: ApiEndpoint;
}

export function mockGsuiteApis(endpoints: ApiEndpoints) {
  return {
    google: {
      admin() {
        return Object.keys(endpoints).reduce(
          (endpointsMock: ApiEndpoint, endpointName: string) => {
            return {
              ...endpointsMock,
              [endpointName]: Object.keys(endpoints[endpointName]).reduce(
                (endpointMock: ApiEndpoint, methodName: string) => {
                  return {
                    ...endpointMock,
                    [methodName]: readFixture(
                      endpoints[endpointName][methodName]
                    )
                  };
                },
                {}
              )
            };
          },
          {}
        );
      }
    }
  };
}

function readFixture(path: string) {
  return async () => {
    const raw = readFileSync(path);
    const result = JSON.parse(raw.toString());
    return result;
  };
}
