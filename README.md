# react-router-sitemap-generator

![Master](https://github.com/clh161/react-router-sitemap-generator/actions/workflows/main.yml/badge.svg?branch=master)
[![npm package](https://img.shields.io/npm/v/react-router-sitemap-generator.svg?style=flat-square)](https://www.npmjs.org/package/react-router-sitemap-generator)
[![npm](https://img.shields.io/npm/dm/react-router-sitemap-generator.svg)](https://www.npmjs.com/package/react-router-sitemap-generator)

Generate `sitemap.xml` from [react-router](https://github.com/ReactTraining/react-router).

## Get started

### Install react-router-sitemap-generator

```shell
yarn add --dev react-router-sitemap-generator
```

### Add babel

```shell
yarn add --dev @babel/node @babel/preset-env @babel/preset-react
```

### Add preset to your babel config file `.babelrc`

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### Add a sitemap generator file

```javascript
// sitemap.js

import Generator from 'react-router-sitemap-generator';
import Router from './component/Router'; //import your react router component

const generator = new Generator(
  'https://react-router-sitemap-generator.com',
  Router(),
  {
    lastmod: new Date().toISOString().slice(0, 10),
    changefreq: 'monthly',
    priority: 0.8,
  }
);
generator.save('public/sitemap.xml');
```

### Run generator file

```shell
yarb run babel-node sitemap.js
```

## Roadmap

- Support nested routes
