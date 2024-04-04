# Contributing

This project was bootstrapped with [create-react-native-library](https://callstack.github.io/react-native-builder-bob/create).

## Development workflow

This project is _not_ a monorepo.

- The library package in the root directory.
- An example expo app in the `example/` directory.
- Storybook in the `storybook/` directory.

To get started with the project, run `npm i` in the root directory to install the required dependencies for developing without the example app or storybook.

```sh
npm i
```

If you want to use the example app or storybook, you have to install the dependencies in the respective directories.

### Example App

If you want to use the example app, run `npm i` inside the `/example` directory.

```sh
cd example && npm i
```

The [example app](/example/) demonstrates usage of the library and works as a development playground.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild, but native code changes will require a rebuild of the example app.

To start the packager, run `npm start` inside the `/example` directory.

```sh
cd example && npm start
```

You can then open the example app in your browser, on your smartphone using the Expo Go App, or inside an iOS Simulator or Android Emulator.

> [!TIP]
> If you switch between Storybook and the Example App on mobile and it doesn't load, ensure you've closed the app before starting it in Expo Go.

### Storybook

If you want to use the example app, run `npm i` inside the `/storybook` directory.

```sh
cd storybook && npm i
```

The [storybook](/storybook/) is used to develop the UI of an embed without having to initialize it. Changes to the library's JavaScript code will be reflected in Storybook without a rebuild.

> [!IMPORTANT]  
> Fast refresh does not work when Storybook is opened on the web, for whatever reason. But it works on mobile.

You can use various commands from the root directory to work with the project.

To start the packager, run `npm start` inside the `/storybook` directory.

```sh
cd storybook && npm start
```

You can then open Storybook in your browser, on your smartphone using the Expo Go App, or inside an iOS Simulator or Android Emulator.

> [!TIP]
> If you switch between Storybook and the Example App on mobile and it doesn't load, ensure you've closed the app before starting it in Expo Go.

## Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
npm run release
```

## Linting

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run typecheck
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint --fix
```

## Testing

We use [jest](https://jestjs.io/) for testing, together with [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) to write better tests.

Run the unit tests by:

```sh
npm test
```
