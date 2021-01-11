# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
