# Actions for `roc-package-webpack-dev`

## Actions
* [roc-package-base-dev](#roc-package-base-dev)
  * [afterClean](#afterClean)
  * [beforeClean](#beforeClean)
* [roc-package-webpack-dev](#roc-package-webpack-dev)
  * [build](#build)
  * [dev](#dev)
  * [webpack](#webpack)

## roc-package-base-dev

### afterClean

Runs after clean command is executed. Logs that the action has been completed successfully.

__Connects to extension:__ `roc-package-base-dev`  
__Connects to hook:__ `after-clean`  

### beforeClean

Runs before clean command is executed. Returns an array of strings that should be removed.

__Connects to extension:__ `roc-package-base-dev`  
__Connects to hook:__ `before-clean`  

## roc-package-webpack-dev

### build

__Connects to extension:__ Not specified  
__Connects to hook:__ `run-build-command`  

### dev

__Connects to extension:__ Not specified  
__Connects to hook:__ `run-dev-command`  

### webpack

Adds base Webpack configuration.

__Connects to extension:__ `roc-package-webpack-dev`  
__Connects to hook:__ `build-webpack`  
