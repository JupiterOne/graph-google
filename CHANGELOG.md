# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 3.16.1 - 2023-04-17

### Changed

- Modified the event log names to values provided by the SDK.

## 3.16.0 - 2023-03-07

### Added

- New properties added to resources:

  | Entity                    | Properties           |
  | ------------------------- | -------------------- |
  | `google_chrome_os_device` | `tpmFamily`          |
  | `google_chrome_os_device` | `tpmFirmwareVersion` |
  | `google_chrome_os_device` | `tpmManufacturer`    |
  | `google_chrome_os_device` | `tpmSpecLevel`       |
  | `google_chrome_os_device` | `tpmModel`           |
  | `google_chrome_os_device` | `tpmVendorId`        |

## 3.15.0 - 2022-12-20

### Changed

- Stopped parsing the username from emails for the following properties on the
  `google_user` entity - `username`, `name` and `displayName`.

## 3.14.0 - 2022-10-06

### Added

- The following **new** entities are now created:

| Resources | Entity `_type`  | Entity `_class` |
| --------- | --------------- | --------------- |
| Device    | `google_device` | `Device`        |

- The following **new** relationships are now created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `google_account`      | **MANAGES**           | `*google_device*`     |

## 3.13.8 - 2022-09-28

### Changed

- use latest sdk
- remove gitleaks

## 3.13.7 - 2022-06-18

### Fixed

- 404 errors for missing group settings are now caught and handled with a
  warning message so it doesn't prevent ingestion of existing group settings.

## 3.13.6 - 2022-06-14

### Fixed

- Updated Google group setting query error handling for authorization errors.

## 3.13.5 - 2022-06-02

### Fixed

- Fixed additional issue (fetch domains step) with permissions issues generating
  Sentry errors.

## 3.13.4 - 2022-06-01

### Fixed

- Fixed issue with permissions issues generating Sentry errors.

## 3.13.3 - 2022-05-24

### Changed

- Bumped sdk-core package to 8.13.10

## 3.13.1 - 2022-05-23

### Changed

- SDK package updates to version 8

## 3.13.0 - 2022-05-20

### Added

- New entity added (_**ACTION REQUIRED**_):

  | Resources        | Entity `_type`            | Entity `_class` |
  | ---------------- | ------------------------- | --------------- |
  | Chrome OS Device | `google_chrome_os_device` | `Device`        |

  Log into the Google Workspace **Admin Console** as a super administrator to
  perform the following actions.

  1. Click **Security** > **API controls**.
  2. In the **Domain wide delegation** pane, select **Manage Domain Wide
     Delegation**.
  3. Click **Edit** near the JupiterOne Service Account and add a new entry
     under **API scopes** for
     `https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly`
  4. Click **Account** > **Admin roles**.
  5. Click the JupiterOne System role, and click Privileges
  6. Under **Services**, **Mobile Devicement Management**, enable **Manage
     Devices and Settings**

- New relationship added:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type`     |
  | --------------------- | --------------------- | ------------------------- |
  | `google_account`      | **MANAGES**           | `google_chrome_os_device` |

## 3.12.5 - 2022-05-06

### Added

- `code-ql` workflow
- `questions` workflow
- managed questions

## 3.12.4 - 2022-04-19

### Fixed

- Authentication issues retrieving MDM data are now reported as an informational
  with which permissions may be missing instead of as an error on the step.

## 3.12.3 - 2022-03-18

### Fixed

- Errors listing tokens are now combined into a single informational message.

## 3.12.2 - 2021-12-16

### Fixed

- Fixed duplicate `_key` issue with `google_mobile_device`

## 3.12.1 - 2021-12-15

### Fixed

- Remove raw data from `google_mobile_device` entities because the value can be
  very large
- Remove the `application` property from `google_mobile_device` entities because
  the value can be very large and does not conform to our data model
- Paginate the list mobile devices API

## 3.12.0 - 2021-12-08

### Added

- New entity added (_**ACTION REQUIRED**_):

  | Resources     | Entity `_type`         | Entity `_class` |
  | ------------- | ---------------------- | --------------- |
  | Mobile Device | `google_mobile_device` | `Device`        |

  Log into the Google Workspace **Admin Console** as a super administrator to
  perform the following actions.

  1. Click **Security** > **API controls**.
  2. In the **Domain wide delegation** pane, select **Manage Domain Wide
     Delegation**.
  3. Click **Edit** near the JupiterOne Service Account and add a new entry
     under **API scopes** for
     `https://www.googleapis.com/auth/admin.directory.device.mobile.readonly`
  4. Click **Account** > **Admin roles**.
  5. Click the JupiterOne System role, and click Privileges
  6. Under **Services**, **Mobile Devicement Management**, enable **Manage
     Devices and Settings**

- New relationship added:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type`  |
  | --------------------- | --------------------- | ---------------------- |
  | `google_account`      | **MANAGES**           | `google_mobile_device` |

### Changed

- Package updates
- Property `emailDomain` on `google_user` is now an array

## 3.11.2 - 2021-11-30

### Fixed

- Roles and role assignments steps now properly handle auth errors due to
  missing scopes or permissions.
- Updated documentation to list an additional permissions requirement for
  querying roles and role assignments.

## 3.11.1 - 2021-11-01

### Changed

- Upgraded `@jupiter/vendor-stack` package.

## 3.11.0 - 2021-10-29

### Changed

- Entities created for targets of mapped `google_token_allows_mapped_vendor`
  relationships will have a `_type`.

### Added

- New properties added to resources:

  | Entity        | Properties    |
  | ------------- | ------------- |
  | `google_user` | `emailDomain` |

## 3.10.0 - 2021-09-28

### Added

- New relationship added:

  | Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
  | --------------------- | --------------------- | --------------------- |
  | `google_user`         | **ASSIGNED**          | `google_role`         |

  Please ensure the `admin.directory.rolemanagement.readonly` API scope is added
  as described in the previous changelog notes.

## 3.9.1 - 2021-09-27

### Added

- New entity added (_**ACTION REQUIRED**_):

  | Resources | Entity `_type` | Entity `_class` |
  | --------- | -------------- | --------------- |
  | Role      | `google_role`  | `AccessRole`    |

  Log into the Google Workspace **Admin Console** as a super administrator to
  perform the following actions.

  1. Click **Security** > **API controls**.
  2. In the **Domain wide delegation** pane, select **Manage Domain Wide
     Delegation**.
  3. Click **Edit** near the JupiterOne Service Account and add a new entry
     under **API scopes** for
     `https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly`

## 3.8.0 - 2021-08-25

### Added

- New properties added to resources:

  | Entity        | Properties      |
  | ------------- | --------------- |
  | `google_user` | `customSchemas` |

### Changed

- Updated JupiterOne SDK packages

## 3.7.1 - 2021-08-04

### Fixed

- If a `400` is recieved from `GroupSettings` endpoint in `getGroupSettings`, it
  is because of an invalid email. This was throwing an error and causing step
  failure. `getGroupSettings` now catches the error and logs if there is a
  `400`, but skips over it to continue ingestion.

## 3.7.0 - 2021-07-13

### Added

- Added `Steps.USERS` to dependsOn for `Steps.GROUPS`
- Added use of `Steps.<<STEP_ID>>` constants

## 3.6.0 - 2021-04-05

### Added

- Support for ingesting the following **new** resources

  - Groups
    - `google_group_settings`
    - `google_group` **HAS** `google_group_settings`

  A Google Workspace administrator must authorize domain wide delegation to the
  JupiterOne Service Account for the scope
  `https://www.googleapis.com/auth/apps.groups.settings`. Please see the updated
  [integration setup guide](docs/jupiterone.md) for details.

## 3.5.0 - 2021-02-01

- Update the following properties on `google_user` entities:

  - Updated `active` to true when the user is not suspended and not archived and
    agreed to terms
  - Updated `mfaEnabled` to true when user is enrolled in 2SV (removed check for
    `isEnforcedIn2Sv`)
  - Removed `thumbnailPhotoEtag` since it is not a useful property to
    index/query on
  - Added normalized timestamp properties: `admin`, `createdOn`, `deletedOn`,
    and `lastLoginOn`
  - Set `employeeType` from `employeeInfo.description`, which corresponds to
    "Type of Employee" in the Google Admin UI under "Employee Information"
    section

## 3.4.1 - 2021-01-27

- Add interval logging of group ingestion activity

## 3.4.0 - 2021-01-27

- Update to `@jupiterone/integration-sdk-*@5.6.1`
- Increase groups and members pagination `maxResults: 200`

## 3.3.2 - 2021-01-11

## Added

- Error handling for API errors.

## 3.3.1 - 2020-11-12

### Added

- A warning when multiple users in the same group have the same email address
- For group members, added `name`, `displayName` to mapped users and groups
- For group member relationships, added member properties `email`, `id`, `kind`,
  `role`, `status`, and `type to better expose properties of the membership

## 3.3.0 - 2020-10-29

### Changed

- Upgrade SDK v4

## 3.2.0 - 2020-10-19

### Added

- Create relationship mapping from google_token Entities to Vendor entities

## 3.1.3 - 2020-09-24

### Fixed

- Converting `user.addresses` objects to flattened fields failed on
  `formatted: undefined` value

## 3.1.2 - 2020-09-10

### Added

- Capture `user.managerEmail` so that the Person can be mapped to his/her
  manager

## 3.1.1 - 2020-09-04

### Fixed

- [#70](https://github.com/JupiterOne/graph-google/issues/70) - Step
  authorization should handle missing OAuth scopes

## 3.1.0 - 2020-08-31

### Added

- Ingest `google_token` and build `google_user` **ASSIGNED** `google_token`
  relationship

## 3.0.0 - 2020-08-31

### Changed

- Updated integration to SDK v3
