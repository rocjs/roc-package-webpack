# Hooks for `roc-package-webpack-dev`

## Hooks
* [roc-package-base-dev](#roc-package-base-dev)
  * [after-clean](#after-clean)
  * [before-clean](#before-clean)
  * [run-build-command](#run-build-command)
  * [run-dev-command](#run-dev-command)
* [roc-package-webpack-dev](#roc-package-webpack-dev)
  * [build-webpack](#build-webpack)
  * [create-watchers](#create-watchers)

## roc-package-base-dev

### after-clean

Hook point for adding code that runs after the clean command is invoked.

__Initial value:__ _Nothing_  
__Expected return value:__ _Nothing_

### before-clean

Hook point for adding code that runs before the clean command is invoked.

__Initial value:__ _Nothing_  
__Expected return value:__ `[String]`

#### Arguments

| Name     | Description                                    | Type |
| -------- | ---------------------------------------------- | ---- |
| settings | The settings object that is received from Roc. | `{}` |

### run-build-command

Use to add things that should react to the build command being called.

__Initial value:__ _Nothing_  
__Expected return value:__ _Nothing_

#### Arguments

| Name    | Description                                                                            | Type       |
| ------- | -------------------------------------------------------------------------------------- | ---------- |
| targets | The targets to build for, will be based on settings or a possible argument if defined. | `[String]` |

### run-dev-command

Use to add things that should react to the dev command being called.

__Initial value:__ _Nothing_  
__Expected return value:__ _Nothing_

#### Arguments

| Name    | Description                                                                           | Type       |
| ------- | ------------------------------------------------------------------------------------- | ---------- |
| targets | The targets use for dev, will be based on settings or a possible argument if defined. | `[String]` |

## roc-package-webpack-dev

### build-webpack

Used to create the final Webpack configuration object.

__Initial value:__ `{"buildConfig":{}}`  
__Expected return value:__ `{}`

#### Arguments

| Name   | Description                                                         | Type     |
| ------ | ------------------------------------------------------------------- | -------- |
| target | The target for which the Webpack configuration should be build for. | `String` |

### create-watchers

Used to add watchers that should follow a specific format.

__Initial value:__ `{}`  
__Expected return value:__ `{Function}`
