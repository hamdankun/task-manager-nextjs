# Unit Testing Setup for Domain Layer

This document describes the unit testing infrastructure created for the Task Manager Next.js application.

## Setup Overview

### 1. Jest Configuration
- **File**: `jest.config.js`
- Configured for TypeScript support
- Path aliases mapped for imports (@domain, @data, @presentation, etc.)
- Test environment: jsdom
- Test files pattern: `tests/**/*.test.ts` and `tests/**/*.test.tsx`

### 2. TypeScript Configuration for Tests
- **File**: `tsconfig.test.json`
- Extends main tsconfig.json
- Includes Jest types
- Covers all test files

### 3. Jest Setup
- **File**: `jest.setup.js`
- Imports @testing-library/jest-dom

### 4. NPM Scripts
Added to package.json:
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Test Files Created

### Domain Layer Tests

#### Entity Tests (tests/domain/entities/)

1. **Task.test.ts**
   - Tests Task entity constructor
   - Tests isCompleted() method
   - Tests isInProgress() method
   - Tests canTransitionTo() method
   - Tests immutability of properties

2. **User.test.ts**
   - Tests User entity constructor
   - Tests getFullName() method
   - Tests isValidEmail() method
   - Tests immutability of properties

#### Use Case Tests (tests/domain/usecases/)

1. **CreateTaskUseCase.test.ts**
   - Tests successful task creation with valid input
   - Tests task creation with optional description
   - Tests validation: empty title
   - Tests validation: title too short
   - Tests validation: title exceeds max length (255)
   - Tests validation: empty userId
   - Tests validation: description exceeds max length (5000)
   - Uses MockTaskRepository for dependency injection

2. **LoginUseCase.test.ts**
   - Tests successful login with correct credentials
   - Tests validation: invalid email format
   - Tests validation: empty email
   - Tests validation: empty password
   - Tests error: user does not exist
   - Tests error: incorrect password
   - Uses MockUserRepository and MockPasswordService for DI

## Mock Objects

### MockTaskRepository
Implements ITaskRepository for testing:
- create()
- findById()
- findByUserId()
- findByUserIdAndStatus()
- update()
- delete()
- exists()
- belongsToUser()

### MockUserRepository
Implements IUserRepository for testing:
- create()
- findById()
- findByEmail()
- update()
- delete()
- existsByEmail()

### MockPasswordService
Implements IPasswordService for testing:
- hash()
- compare()

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- Task.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create a task"
```

## Test Structure

Each test file follows this pattern:

```typescript
import { EntityOrUseCase } from '@domain/...'
import { MockRepository } from './mocks'

describe('Feature Name', () => {
  let useCase: UseCase
  let mockRepository: MockRepository

  beforeEach(() => {
    mockRepository = new MockRepository()
    useCase = new UseCase(mockRepository)
  })

  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

## Coverage Goals

- ✅ Domain Layer Entities: 100%
- ✅ Domain Layer Use Cases: 100% (core validation and logic)
- ⏳ Data Layer Repositories: (to be added)
- ⏳ Server Actions: (to be added)
- ⏳ React Components: (to be added)

## Next Steps

To add more tests:

1. Create test file in appropriate tests/ directory
2. Import entities/use cases to test
3. Create mock implementations of dependencies
4. Write test cases with arrange-act-assert pattern
5. Run `npm test` to verify

## Dependencies

Dev Dependencies Added:
- `@testing-library/jest-dom@^6.1.5` - DOM matchers
- `@testing-library/react@^14.1.2` - React testing utilities
- `@types/jest@^29.5.11` - Jest type definitions
- `jest@^29.7.0` - Testing framework
- `jest-environment-jsdom@^29.7.0` - DOM test environment

## Notes

- All tests follow Clean Architecture principles
- Mock objects use dependency injection
- Tests are isolated and don't interact with actual database
- Each test is independent and can run in any order
- Type-safe test code with full TypeScript support
