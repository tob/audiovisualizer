# Testing Guide

This project uses Jest for unit testing with TypeScript support.

## Setup

Install the required testing dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/jest-dom
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in `__tests__` folders within their respective modules:

- `src/javascript/utils/__tests__/` - Tests for utility functions
- `src/javascript/drawings/__tests__/` - Tests for drawing functions

Each test file is named after the module it tests with a `.test.ts` suffix.

## Test Files

### Utils Tests
- **colors.test.ts** - Tests for `hexToRGB` and `rgbToHex` functions
- **math.test.ts** - Tests for `normalizeValue`, `getAverageValue`, `getIndexFromValue`, `getPercentage`
- **transform.test.ts** - Tests for `rotate` and `updateAngles` functions
- **layer-settings.test.ts** - Tests for `settings` and `RANGES` configuration objects

### Drawings Tests
- **shapes.test.ts** - Tests for `inRange`, `circlePos`, `getPatternXy` functions
- **drawSettings.test.ts** - Tests for `getType` function

## Writing Tests

Tests follow the AAA pattern:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the function being tested
- **Assert**: Verify the results

Example:
```typescript
describe('myFunction', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 5;

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe(10);
  });
});
```

## Mocks

The test setup (`jest.setup.js`) provides mocks for:
- Web Audio API (`AudioContext`)
- Animation frame API (`requestAnimationFrame`, `cancelAnimationFrame`)

These mocks allow testing audio and animation code without a browser environment.

## Coverage

The coverage report shows which parts of the code are tested:
- **Statements**: Individual statements executed
- **Branches**: Conditional paths taken (if/else)
- **Functions**: Functions called
- **Lines**: Lines of code executed

Target: Maintain >80% coverage for utility functions.

## CI/CD Integration

Tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Notes

- Tests run in jsdom environment (simulated browser)
- DOM-dependent tests may require additional setup
- Complex integration tests for audio visualization are not included
- Focus is on pure functions and utility methods
