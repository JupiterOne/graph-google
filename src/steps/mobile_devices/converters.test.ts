import { createMobileDeviceEntity } from './converters';
import { admin_directory_v1 } from 'googleapis';

function getMockDevice(): admin_directory_v1.Schema$MobileDevice {
  return {
    // this mock device from https://developers.google.com/admin-sdk/directory/v1/guides/manage-mobile-devices
    kind: 'directory#mobiledevice',
    resourceId: 'resourceId',
    deviceId: 'deviceId',
    name: ['Liz'],
    email: ['liz@example.com'],
    model: 'Galaxy Nexus',
    os: 'Android 4.2.2',
    type: 'ANDROID',
    status: 'APPROVED',
    hardwareId: '9123456780',
    firstSync: '2013-06-05T17:30:04.325Z',
    lastSync: '2013-08-12T17:30:04.325Z',
    userAgent: 'Google Apps Device Policy 4.14',
  };
}

function getMockDeviceWithMoreProps(): admin_directory_v1.Schema$MobileDevice {
  return {
    // this mock device built from https://developers.google.com/admin-sdk/directory/v1/guides/manage-mobile-devices
    kind: 'directory#mobiledevice',
    resourceId: 'resourceId',
    deviceId: 'deviceId',
    name: ['Sales'],
    email: ['sales@example.com'],
    model: 'Nexus 4',
    os: 'Android 4.2.2',
    type: 'ANDROID',
    status: 'APPROVED',
    hardwareId: '1234567890',
    firstSync: '2013-05-15T17:30:04.325Z',
    lastSync: '2013-06-05T17:30:04.325Z',
    userAgent: 'Google Apps Device Policy 4.14',
    serialNumber: '123456789ABC',
    adbStatus: true,
    applications: [
      {
        displayName: 'SomeApp',
        packageName: 'some package',
        permission: ['yep', 'nope'],
        versionCode: 9876545,
        versionName: 'some version',
      },
    ],
    brand: 'My brand',
    deviceCompromisedStatus: 'not yet',
    encryptionStatus: 'not today',
    hardware: 'Home Depot',
    imei: '1234567fghjtyty',
    manufacturer: 'Google',
    wifiMacAddress: '00:00:00:00:00:01',
  };
}

describe('#createDeviceEntity', () => {
  test('should convert to device entity', () => {
    expect(createMobileDeviceEntity(getMockDevice())).toMatchSnapshot();
  });
});

describe('#createExpandedDeviceEntity', () => {
  test('should convert to device entity with more props', () => {
    expect(
      createMobileDeviceEntity(getMockDeviceWithMoreProps()),
    ).toMatchSnapshot();
  });
});
