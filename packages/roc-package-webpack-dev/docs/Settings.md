# Settings for `roc-package-webpack-dev`

## Build

| Name               | Description                                                                                              | Path                     | CLI option                 | Default          | Type                    | Required |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- | ---------------- | ----------------------- | -------- |
| disableProgressbar | Should the progress bar be disabled for builds.                                                          | build.disableProgressbar | --build-disableProgressbar | `false`          | `Boolean`               | No       |
| input              | The entry point for the build.                                                                           | build.input              | --build-input              | `"src/index.js"` | `Filepath / [Filepath]` | No       |
| mode               | What mode the application should be built for. Possible values are &quot;dev&quot; and &quot;dist&quot;. | build.mode               | --build-mode               | `"dist"`         | `/^dev|dist$/i`         | No       |
| output             | The output directory for the build.                                                                      | build.output             | --build-output             | `"build"`        | `Filepath / [Filepath]` | No       |
| outputName         | The name of the generated application bundle, will be appended &quot;roc.js&quot;.                       | build.outputName         | --build-outputName         | `"app"`          | `String / [String]`     | No       |
| path               | The basepath for the application.                                                                        | build.path               | --build-path               | `"/"`            | `Filepath`              | No       |
| targets            | For what targets the code should be built for.                                                           | build.targets            | --build-targets            | `null`           | `[]`                    | No       |

## Dev

| Name               | Description                                                                                              | Path                     | CLI option                 | Default          | Type                    | Required |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------- | ---------------- | ----------------------- | -------- |
| debug              | Filter for debug messages that should be shown during development, see https://npmjs.com/package/debug.  | dev.debug                | --dev-debug                | `"roc:*"`        | `String`                | No       |
