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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
