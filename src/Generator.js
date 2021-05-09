// @flow strict

const fs = require('fs');
const convertor = require('xml-js');
import React from 'react';

const DEFAULT_XML_CONFIG = {
  lastmod: new Date().toISOString().slice(0, 10),
  changefreq: 'monthly',
  priority: 0.8,
};

export type XmlConfig = {
  lastmod?: string,
  changefreq?: string,
  priority?: number,
};

export default class Generator {
  _baseUrl: string;
  _baseComponent: () => any;

  constructor(baseUrl: string, baseComponent: any) {
    if (!React.isValidElement(baseComponent)) {
      throw 'Invalid component. Try `Router()` instead of `Router`';
    }
    this._baseUrl = baseUrl;
    this._baseComponent = baseComponent;
  }

  getXML(config: ?XmlConfig): string {
    const { lastmod, changefreq, priority } = {
      ...DEFAULT_XML_CONFIG,
      ...config,
    };

    const paths = componentToPaths(this._baseComponent);
    const options = { compact: true, spaces: 4 };
    const map = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8',
        },
      },
      urlset: {
        url: paths.map((path) => {
          return {
            loc: this._baseUrl + path,
            lastmod,
            changefreq,
            priority,
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

function componentToPaths(_baseComponent: any): Array<string> {
  const paths = [];
  const components: Array<any> = [_baseComponent];
  while (components.length !== 0) {
    const component = components.pop();
    if (!React.isValidElement(component)) continue;
    const { props } = component;
    if (props == null) continue;
    const { path, component: propsComponents } = props;
    React.Children.forEach(component.props.children, (child) => {
      components.push(...getComponents(child));
    });
    if (component.type.name === 'Route') {
      if (path != null) {
        paths.push(path);
      }
      if (typeof propsComponents === 'function') {
        components.push(
          ...getComponents(propsComponents({ match: { url: path } }))
        );
      }
    }
  }
  return paths;
}

function getComponents(components: any | Array<any>): Array<any> {
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
