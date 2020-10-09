# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
