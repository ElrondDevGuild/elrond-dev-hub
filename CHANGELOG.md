# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup.
- Created CHANGELOG.md to track changes.

### Changed
- Standardized all forms in `components/forms`:
    - Migrated forms using `useState` (`SubmitLeaderboardProject`, `SubmitBounty`, `SubmitTeamFinder`, `RequestUpdate`) to `react-hook-form`.
    - Ensured all forms utilize shared components (`Input`, `Select`, `Textarea`, `Button`) from `components/shared`.
    - Implemented consistent layout for labels, required indicators, and help text.
    - Standardized submission feedback (success/error messages) using inline `motion` components instead of alerts or redirects.
    - Added consistent modal structure and overflow handling. 