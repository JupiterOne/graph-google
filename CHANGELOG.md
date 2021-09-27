# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
