# Enforce consistent use of the `node:` protocol when importing Node.js builtin modules (`node-import/prefer-node-protocol`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Rule Details

When importing builtin modules, it's better to use the [`node:` protocol](https://nodejs.org/api/esm.html#node-imports) as it makes it perfectly clear that the package is a Node.js builtin module.

Node.js began supporting this feature began in:

> v16.0.0, v14.18.0 (`require()`)
>
> v14.13.1, v12.20.0 (`import`)

If you're writing code targetting older versions of Node.js, you might want to turn on the `disallow` option (see below).

**Incorrect**

```js
import dgram from "dgram";
export { strict as default } from "assert";
import fs from "fs/promises";
const fs = require("fs/promises");
```

**Correct**

```js
import dgram from "node:dgram";
export { strict as default } from "node:assert";
import fs from "node:fs/promises";
const fs = require("node:fs/promises");
import fs from "./fs.js";
import _ from "lodash";
const fs = require(`fs`);
```

## Options

```json
{
	"node-import/prefer-node-protocol": ["warn", { "disallow": false }]
}
```

### disallow

By default, this rule will only warn about imports that **don't** use the `node:` protocol. If you want to disallow them instead, set this option to `true`.

**Incorrect**

```js
import fs from "node:fs/promises";
const fs = require("node:fs/promises");
```

**Correct**

```js
import fs from "fs/promises";
const fs = require("fs/promises");
```

## When Not To Use It

If you don't care about consistent use of the `node:` protocol, you can safely disable this rule.
