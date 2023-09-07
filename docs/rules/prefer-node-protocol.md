# Prefer using the `node:` protocol when importing Node.js builtin modules (`node-import/prefer-node-protocol`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When importing builtin modules, it's better to use the [`node:` protocol](https://nodejs.org/api/esm.html#node-imports) as it makes it perfectly clear that the package is a Node.js builtin module.

Note that Node.js support for this feature began in:

> v16.0.0, v14.18.0 (`require()`)
>
> v14.13.1, v12.20.0 (`import`)

As such, the minimal Node version for this plugin is v14.18.0.

## Fail

```js
import dgram from "dgram";
```

```js
export { strict as default } from "assert";
```

```js
import fs from "fs/promises";
```

```js
const fs = require("fs/promises");
```

## Pass

```js
import dgram from "node:dgram";
```

```js
export { strict as default } from "node:assert";
```

```js
import fs from "node:fs/promises";
```

```js
const fs = require("fs");
```

```js
import _ from "lodash";
```

```js
import fs from "./fs.js";
```

```js
const fs = require("node:fs/promises");
```
