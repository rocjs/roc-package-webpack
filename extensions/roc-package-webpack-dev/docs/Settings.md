# Settings for `roc-package-webpack-dev`

## Build
Build settings.

| Name               | Description                                                                                              | Path                     | CLI option                 | Default          | Type                    | Required | Can be empty | Extensions                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- | ---------------- | ----------------------- | -------- | ------------ | ------------------------------------------------------ |
| disableProgressbar | Should the progress bar be disabled for builds.                                                          | build.disableProgressbar | --build-disableProgressbar | `false`          | `Boolean`               | Yes      |              | roc-package-webpack-dev                                |
| input              | The entry point for the build.                                                                           | build.input              | --build-input              | `"src/index.js"` | `[Filepath] / Filepath` | Yes      | No           | roc-abstract-package-base-dev, roc-package-webpack-dev |
| mode               | What mode the application should be built for. Possible values are &quot;dev&quot; and &quot;dist&quot;. | build.mode               | --build-mode               | `"dist"`         | `/^dev|dist$/i`         | Yes      | No           | roc-package-webpack-dev                                |
| name               | The name of the generated application bundle.                                                            | build.name               | --build-name               | `"app"`          | `[String] / String`     | Yes      | No           | roc-package-webpack-dev                                |
| output             | The output directory for the build.                                                                      | build.output             | --build-output             | `"build"`        | `[Filepath] / Filepath` | Yes      | No           | roc-abstract-package-base-dev, roc-package-webpack-dev |
| path               | The basepath for the application.                                                                        | build.path               | --build-path               | `"/"`            | `Filepath`              | Yes      | No           | roc-package-webpack-dev                                |
| targets            | For what targets the code should be built for.                                                           | build.targets            | --build-targets            |                  | `[String]`              | Yes      | No           | roc-abstract-package-base-dev                          |

## Dev
Development settings.

| Name               | Description                                                                                              | Path                     | CLI option                 | Default          | Type                    | Required | Can be empty | Extensions                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- | ---------------- | ----------------------- | -------- | ------------ | ------------------------------------------------------ |
| debug              | Filter for debug messages that should be shown during development, see https://npmjs.com/package/debug.  | dev.debug                | --dev-debug                |                  | `String`                | No       | No           | roc-abstract-package-base-dev                          |
| host               | The host to use during development, will be automatically defined if left empty.                         | dev.host                 | --dev-host                 |                  | `String`                | No       | No           | roc-package-webpack-dev                                |
| port               | Port for the dev server.                                                                                 | dev.port                 | --dev-port                 | `3001`           | `Integer`               | Yes      |              | roc-package-webpack-dev                                |
