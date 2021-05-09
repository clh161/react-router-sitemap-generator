const fs = require('fs');
const convertor = require('xml-js');
import React from 'react';

export default class Generator {
  _paths = [];

  constructor(baseUrl, baseComponent) {
    this._baseUrl = baseUrl;
    this._baseComponent = baseComponent;
  }

  _generate() {
    this._paths = [];
    const components = [];
    components.push(this._baseComponent());
    while (components.length !== 0) {
      const component = components.pop();
      const { props } = component;
      if (props != null) {
        const {
          children: nestedComponent,
          path,
          component: propsComponents,
        } = props;
        if (path != null && component.type.name === 'Route') {
          this._paths.push(path);
        }
        components.push(...this._getComponents(nestedComponent));
        components.push(
          ...this._getComponents(propsComponents?.({ match: { url: path } }))
        );
      }
    }
  }

  _getComponents(components) {
    const _components = [];
    if (Array.isArray(components)) {
      components?.forEach((child) => {
        _components.push(child);
      });
    } else if (components != null) {
      _components.push(components);
    }
    return _components;
  }

  getXML() {
    this._generate();
    const options = { compact: true, spaces: 4 };
    const map = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8',
        },
      },
      urlset: {
        url: this._paths.map((path) => {
          return {
            loc: this._baseUrl + path,
            lastmod: '2021-01-01',
            changefreq: 'monthly',
            priority: 0.8,
          };
        }),
        _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      },
    };
    return convertor.js2xml(map, options);
  }

  save(path) {
    const xml = this.getXML();
    fs.writeFileSync(path, xml);
  }
}
