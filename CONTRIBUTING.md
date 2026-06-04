# Contributing

## Prerequisites

- .NET 10 SDK
- Visual Studio 2022 17.14+
- Node.js 22+ (for the backoffice component)


## Getting started

Clone the repo and open `Knowit.Umbraco.SvgPicker.sln` in Visual Studio.

### Frontend

The property editor UI is a Lit/TypeScript component that must be built before running the test site:

```
cd src/Knowit.Umbraco.SvgPicker/client
npm install
npm run build      # one-off build
npm run dev        # watch mode during development
```

The output lands in `App_Plugins/SvgPicker/svg-picker.js` automatically.

### Test site

The test site runs on `https://localhost:44303`. Complete the Umbraco install wizard on first run.

A sample spritesheet with 8 symbols is included at `testsite/.../wwwroot/assets/svg/sprite.svg`. Configure a data type using **SVG Picker** with sprite path `/assets/svg/sprite.svg` to try it out.

> **Important:** Stop the test site before rebuilding the solution. The test site holds the package DLL open while running, which causes MSBuild to fail with a file lock error. This is normal .NET behaviour and only affects local development.

The `App_Plugins` folder in the test site is a directory junction pointing at the source — no rebuild is needed after changing dashboard files, just refresh the browser.
