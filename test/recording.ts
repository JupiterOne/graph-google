import {
  Recording,
  mutations,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
export { Recording } from '@jupiterone/integration-sdk-testing';

type SetupParameters = Parameters<typeof setupRecording>[0];

enum GoogleHeaders {
  UPLOADER = 'x-guploader-uploadid',
}

function getRedactedOAuthResponse() {
  return {
    access_token: '[REDACTED]',
    expires_in: 9999,
    token_type: 'Bearer',
  };
}

export function setupIntegrationRecording({
  name,
  directory,
  ...overrides
}: SetupParameters): Recording {
  return setupRecording({
    directory,
    name,
    redactedResponseHeaders: [GoogleHeaders.UPLOADER],
    mutateEntry: (entry) => {
      redact(entry);
    },
    ...overrides,
    options: {
      matchRequestsBy: {
        headers: false,
        body: false,
        order: false,
      },
      ...overrides.options,
    },
  });
}

function redact(entry): void {
  mutations.unzipGzippedRecordingEntry(entry);

  const requestUrl: string = entry.request.url;

  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  if (requestUrl === 'https://www.googleapis.com/oauth2/v4/token') {
    entry.response.content.text = JSON.stringify(getRedactedOAuthResponse());
    return;
  }

  entry.response.content.text = entry.response.content.text.replace(
    /\r?\n|\r/g,
    '',
  );
}
