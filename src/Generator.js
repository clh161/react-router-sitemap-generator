// @flow strict

const fs = require('fs');
const convertor = require('xml-js');
import React from 'react';

export default class Generator {
  _paths: Array<string> = [];
  _baseUrl: string;
  _baseComponent: () => any;

  constructor(baseUrl: string, baseComponent: any) {
    if (!React.isValidElement(baseComponent)) {
      throw 'Invalid component. Try `Router()` instead of `Router`';
    }
    this._baseUrl = baseUrl;
    this._baseComponent = baseComponent;
  }

  _generate() {
    this._paths = [];
    const components: Array<any> = [];
    components.push(this._baseComponent);
    while (components.length !== 0) {
      const component = components.pop();
      if (!React.isValidElement(component)) continue;
      const { props } = component;
      if (props == null) continue;
      const { path, component: propsComponents } = props;
      React.Children.forEach(component.props.children, (child) => {
        components.push(...this._getComponents(child));
      });
      if (component.type.name === 'Route') {
        if (path != null) {
          this._paths.push(path);
        }
        if (typeof propsComponents === 'function') {
          components.push(
            ...this._getComponents(propsComponents({ match: { url: path } }))
          );
        }
      }
    }
  }

  _getComponents(components: any | Array<any>): Array<any> {
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

  getXML(): string {
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

  save(path: string) {
    const xml = this.getXML();
    fs.writeFileSync(path, xml);
  }
}
