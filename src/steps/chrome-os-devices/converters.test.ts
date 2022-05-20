import { createChromeOSDeviceEntity } from './converters';
import { admin_directory_v1 } from 'googleapis';

function getMockDevice(): admin_directory_v1.Schema$ChromeOsDevice {
  return {
    // this mock device from https://developers.google.com/admin-sdk/directory/v1/guides/manage-mobile-devices
    kind: 'directory#mobiledevice',
    deviceId: 'deviceId',
    model: 'Galaxy Nexus',
    osVersion: 'Android 4.2.2',
    status: 'APPROVED',
    lastSync: '2013-08-12T17:30:04.325Z',
  };
}

function getMockDeviceWithMoreProps(): admin_directory_v1.Schema$ChromeOsDevice {
  return {
    kind: 'admin#directory#chromeosdevice',
    etag:
      '"AX6M7SfKZ_nsxN3gDLY5FqkOIZdXe4fOIyur1mUmk1Y/z-lQehTt9Fjz_pphpwc1IT8eHBQ"',
    deviceId: '06d4fd60-bed5-4fe2-8d82-1a7b7b76f9ac',
    serialNumber: '3WAZ9FGNC00030E',
    status: 'ACTIVE',
    lastSync: '2022-05-19T13:33:05.700Z',
    annotatedUser: 'integration-development@jupiterone.dev',
    model: 'Samsung Galaxy Chromebook',
    osVersion: '89.0.4389.95',
    platformVersion: '13729.56.0 (Official Build) stable-channel hatch',
    firmwareVersion: 'Google_Kohaku.12672.199.0',
    macAddress: '2cdb07af9a83',
    bootMode: 'Verified',
    lastEnrollmentTime: '2022-05-19T13:33:02.539Z',
    orgUnitPath: '/',
    activeTimeRanges: [
      {
        date: '2022-05-19',
        activeTime: 30000,
      },
    ],
    tpmVersionInfo: {
      family: '322e3000',
      specLevel: '74',
      manufacturer: '43524f53',
      tpmModel: '1',
      firmwareVersion: '9d5b602704bc089b',
      vendorSpecific: 'xCG fTPM',
    },
    cpuStatusReports: [
      {
        reportTime: '2022-05-19T13:33:09.569Z',
      },
      {
        reportTime: '2022-05-19T13:34:09.558Z',
      },
    ],
    systemRamTotal: '8218206208',
    systemRamFreeReports: [
      {
        reportTime: '2022-05-19T13:33:09.569Z',
      },
    ],
    diskVolumeReports: [{}],
    manufactureDate: '2020-12-04',
    autoUpdateExpiration: '1843455600000',
    cpuInfo: [
      {
        model: 'Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz',
        architecture: 'x64',
        maxClockSpeedKhz: 4200000,
      },
    ],
  };
}

describe('#createDeviceEntity', () => {
  test('should convert to device entity', () => {
    expect(createChromeOSDeviceEntity(getMockDevice())).toMatchSnapshot();
  });
});

describe('#createExpandedDeviceEntity', () => {
  test('should convert to device entity with more props', () => {
    expect(
      createChromeOSDeviceEntity(getMockDeviceWithMoreProps()),
    ).toMatchSnapshot();
  });
});
