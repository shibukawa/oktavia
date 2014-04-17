# oktavia [![Build Status](https://travis-ci.org/shibukawa/oktavia.png?branch=master)](https://travis-ci.org/shibukawa/oktavia) [![Dependency Status](https://david-dm.org/shibukawa/oktavia.png)](https://david-dm.org/shibukawa/oktavia) [![devDependency Status](https://david-dm.org/shibukawa/oktavia/dev-status.png)](https://david-dm.org/shibukawa/oktavia#info=devDependencies)

Synopsis
---------------

Full text search engine in JavaScript environment based on FM-index algorithm.

Motivation
---------------

Write a short description of the motivation behind the creation and maintenance of the project.
This should explain why the project exists.

Code Example
---------------

### Use from JSX

```js
import "oktavia.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        // Write simple usage here!
    }
}
```

### Use from node.js

```js
var oktavia = require('oktavia.common.js').oktavia;

// Write simple usage here!
```

### Use from require.js

```js
// use oktavia.amd.js
define(['oktavia'], function (oktavia) {

    // Write simple usage here!
});
```

### Use via standard JSX function

```html
<script src="oktavia.js" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var classObj = JSX.require("src/oktavia.js").oktavia;
    var obj = new classObj();
});
</script>
```

### Use via global variables

```html
<script src="oktavia.global.js" type="text/javascript"></script>
<script type="text/javascript">
window.onload = function () {
    var obj = new oktavia.oktavia();
});
</script>
```

Installation
---------------

```sh
$ npm install oktavia
```

API Reference
------------------

Write reference here!

Development
-------------

## JSX

Don't be afraid [JSX](http://jsx.github.io)! If you have an experience of JavaScript, you can learn JSX
quickly.

* Static type system and unified class syntax.
* All variables and methods belong to class.
* JSX includes optimizer. You don't have to write tricky unreadalbe code for speed.
* You can use almost all JavaScript API as you know. Some functions become static class functions. See [reference](http://jsx.github.io/doc/stdlibref.html).

## Setup

To create development environment, call following command:

```sh
$ npm install
```

## Repository

* Repository: git://github.com/shibukawa/oktavia.git
* Issues: https://github.com/shibukawa/oktavia/issues

## Run Test

```sh
$ grunt test
```

## Build

```sh
$ grunt build
```

## Generate API reference

```sh
$ grunt doc
```

Author
---------

* shibukawa / yoshiki@shibu.jp

License
------------

MIT

Complete license is written in `LICENSE.md`.
