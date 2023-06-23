import { Steps } from '../../constants';
import { buildStepTestConfig } from '../../../test/config';
import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { Recording, setupIntegrationRecording } from '../../../test/recording';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetch-chrome-extensions', () => {
  test('success', async () => {
    recording = setupIntegrationRecording({
      name: 'fetch-chrome-extensions',
      directory: __dirname,
      options: {
        recordFailedRequests: false,
      },
    });

    const stepConfig = buildStepTestConfig(Steps.CHROME_EXTENSIONS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchSnapshot();
  });
});
