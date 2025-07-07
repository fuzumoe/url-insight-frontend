# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:unit`

Runs unit tests once without watching for changes.

### `npm run test:unit:watch`

Runs unit tests in interactive watch mode.

### `npm run test:e2e`

Runs end-to-end tests using Cypress in headless mode.

### `npm run test:e2e:open`

Opens Cypress Test Runner for interactive e2e testing.

### `npm run test:e2e:ci`

Runs e2e tests in CI mode - starts the development server and runs Cypress tests against it.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Code Quality Setup

This project uses ESLint for linting and Prettier for code formatting.

### Code Quality Scripts

- `npm run lint` - Run ESLint on all TypeScript/JavaScript files
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically run linting and formatting before each commit:

- ESLint will check and fix linting issues
- Prettier will format the code
- Only staged files will be processed

### Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore during formatting
- `.vscode/settings.json` - VS Code settings for consistent formatting

### VS Code Extensions

For the best development experience, install these VS Code extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)

### Rules Overview

The ESLint configuration includes:

- TypeScript recommended rules
- React recommended rules
- React Hooks rules
- Prettier integration
- Custom rules for unused variables, console warnings, etc.

The Prettier configuration uses:

- Single quotes
- Semicolons
- 2-space indentation
- Trailing commas where valid
- 80 character line width

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification with automated validation through commitlint and Husky hooks.

### Pre-commit Hooks

The following hooks are automatically run:

- **pre-commit**: Runs lint-staged (ESLint + Prettier) and tests
- **commit-msg**: Validates commit message format 

### Commit Message Format

```
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples**:
```bash
feat: add user authentication
fix: resolve navigation menu bug
docs: update API documentation
test: add unit tests for payment service
```

### Testing Commit Messages

```bash
# Test a commit message
echo "feat: add new feature" | npm run commitlint

# Check last commit
npm run commitlint:last
```

For detailed guidelines, see [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md).

## Testing

This project includes both unit and end-to-end (e2e) testing infrastructure:

### Unit Testing

- **Framework**: Jest + React Testing Library
- **Location**: Test files are located alongside source files or in `src/__tests__/`
- **Test Utils**: Custom render utilities in `src/test-utils/` with testing providers

**Running Unit Tests:**
```bash
npm run test:unit        # Run once
npm run test:unit:watch  # Run in watch mode
npm test                 # Interactive watch mode (default)
```

### End-to-End Testing

- **Framework**: Cypress
- **Location**: Tests are in `cypress/e2e/`
- **Configuration**: `cypress.config.ts`

**Running E2E Tests:**
```bash
npm run test:e2e         # Run headless
npm run test:e2e:open    # Open Cypress UI
npm run test:e2e:ci      # CI mode (starts server + runs tests)
```

### Test Structure

```
src/
├── __tests__/           # Unit tests
├── test-utils/          # Testing utilities
└── components/
    └── __tests__/       # Component tests
cypress/
├── e2e/                # E2E tests
├── fixtures/           # Test data
└── support/            # Support files
```

## Credits

Emojis used in this project are sourced from [Emojipedia](https://emojipedia.org/).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
