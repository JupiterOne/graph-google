import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';
import { gunzipSync } from 'zlib';
export { Recording } from '@jupiterone/integration-sdk-testing';

type SetupParameters = Parameters<typeof setupRecording>[0];

enum GoogleHeaders {
  UPLOADER = 'x-guploader-uploadid',
}

function gzipStringToUtf8(str: string) {
  const chunkBuffers: Buffer[] = [];
  const hexChunks = JSON.parse(str) as string[];

  hexChunks.forEach((chunk) => {
    const chunkBuffer = Buffer.from(chunk, 'base64');
    chunkBuffers.push(chunkBuffer);
  });

  return gunzipSync(Buffer.concat(chunkBuffers)).toString('utf-8');
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
  const requestUrl: string = entry.request.url;

  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  let responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  const contentEncoding = entry.response.headers.find(
    (e) => e.name === 'content-encoding',
  );
  const transferEncoding = entry.response.headers.find(
    (e) => e.name === 'transfer-encoding',
  );

  if (contentEncoding && contentEncoding.value === 'gzip') {
    // Remove encoding/chunking since content is going to be unzipped
    entry.response.headers = entry.response.headers.filter(
      (e) => e && e !== contentEncoding && e !== transferEncoding,
    );

    // Remove recording binary marker
    delete (entry.response.content as any)._isBinary;

    if (requestUrl === 'https://www.googleapis.com/oauth2/v4/token') {
      entry.response.content.text = JSON.stringify(getRedactedOAuthResponse());
      return;
    }

    responseText = gzipStringToUtf8(responseText);

    const parsedResponseText = JSON.parse(
      responseText.replace(/\r?\n|\r/g, ''),
    );
    entry.response.content.encoding = undefined;
    entry.response.content.text = JSON.stringify(parsedResponseText);
  }
}
