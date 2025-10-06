# GitHub Actions CI/CD Setup

This repository is configured with GitHub Actions to automatically run all tests when:
- New commits are pushed to the `main` branch
- Pull requests are submitted targeting the `main` branch

## Workflows

### 1. `test.yml` - Basic Test Runner
- Runs on Ubuntu with Node.js 23.x and 24.x
- Executes all three test suites:
  - Simple tests (mocha+chai): `npm run test:simple`
  - Functional tests (mocha+chai): `npm run test:functional`
  - Playwright tests: `npm test`
- Uploads Playwright reports on failure

### 2. `ci.yml` - Comprehensive CI Pipeline
- **Lint and Validate Job**: Security audit and package validation (Node.js 24.x)
- **Test Coverage Job**: Tests across Node.js versions (23.x, 24.x)
  - Since this is a browser-native web components project, only Ubuntu is used
  - Focuses on latest Node.js versions for modern development tooling
  - Generates test result summaries for each Node.js version

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