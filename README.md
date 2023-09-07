# eslint-plugin-node-import

Disallow imports of built-in Node.js modules without the `node:` prefix

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-node-import`:

```sh
npm install eslint-plugin-node-import --save-dev
```

## Usage

Add `node-import` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["node-import"]
}
```

Then configure the (only) rule under the `rules` section.

```json
{
	"rules": {
		"node-import/prefer-node-protocol": 2
	}
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                       | Description                                                               | 🔧  |
| :--------------------------------------------------------- | :------------------------------------------------------------------------ | :-- |
| [prefer-node-protocol](docs/rules/prefer-node-protocol.md) | Prefer using the `node:` protocol when importing Node.js builtin modules. | 🔧  |

<!-- end auto-generated rules list -->

## Credits

This plugin is a composite of two different custom ESLint rules:

- [@alex-kinokon](https://github.com/alex-kinokon)'s `eslint-import-require-node-prefix` from [this GitHub Gist](https://gist.github.com/alex-kinokon/f8f373e1a6bb01aa654d9085f2cff834)
- [Sindre Sorhus](https://github.com/sindresorhus)' `prefer-node-protocol` from [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/6d15a02d48de7ecfc38d0683a8487b2f937d83a0/rules/prefer-node-protocol.js)

## Licence

© 2023 [Nikita Karamov]\
Licensed under the [ISC License][ISC]

---

This project is hosted on GitHub:
<https://github.com/kytta/eslint-plugin-node-import.git>

[ISC]: https://spdx.org/licenses/ISC.html
[Nikita Karamov]: https://www.kytta.dev/
