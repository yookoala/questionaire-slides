# GitHub Actions CI/CD Setup

This repository is configured with GitHub Actions to automatically run all tests when:
- New commits are pushed to the `main` branch
- Pull requests are submitted targeting the `main` branch

## Workflows

### 1. `test.yml` - Basic Test Runner
- Runs on Ubuntu with Node.js 18.x and 20.x
- Executes all three test suites:
  - Simple tests (mocha+chai): `npm run test:simple`
  - Functional tests (mocha+chai): `npm run test:functional`
  - Playwright tests: `npm test`
- Uploads Playwright reports on failure

### 2. `ci.yml` - Comprehensive CI Pipeline
- **Lint and Validate Job**: Security audit and package validation
- **Test Matrix Job**: Tests across multiple OS and Node.js versions
  - Operating Systems: Ubuntu, Windows, macOS
  - Node.js versions: 18.x, 20.x, 21.x
  - Excludes some combinations to optimize CI time
- **Test Coverage Job**: Generates test result summaries

## Test Coverage

The CI runs the following test suites:

1. **Mocha Unit Tests** (`test:simple`): 35 tests covering component instantiation, properties, and basic functionality
2. **Mocha Functional Tests** (`test:functional`): 8 tests covering carousel navigation and DOM manipulation
3. **Playwright Integration Tests** (`test`): 41 tests covering all HTML test files with browser automation

## Local Testing

To run the same tests locally:

```bash
# Run all tests (same as CI)
npm run test:simple
npm run test:functional
npm test

# Or run individual test suites
npm run test:simple    # Mocha unit tests
npm run test:functional # Mocha functional tests
npm test               # Playwright browser tests
```

## Artifacts

When tests fail, the following artifacts are uploaded for debugging:
- Playwright HTML reports
- Test result files
- Screenshots and traces (when applicable)

Artifacts are retained for 7-30 days depending on the workflow.