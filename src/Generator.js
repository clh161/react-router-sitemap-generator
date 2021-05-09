// @flow strict

const fs = require('fs');
const convertor = require('xml-js');
import React from 'react';

const DEFAULT_CONFIG = {
  lastmod: new Date().toISOString().slice(0, 10),
  changefreq: 'monthly',
  priority: 0.8,
};

export type Config = {
  lastmod?: string,
  changefreq?: string,
  priority?: number,
};

export default class Generator {
  _baseUrl: string;
  _baseComponent: () => any;
  _config: ?Config;

  constructor(baseUrl: string, baseComponent: any, config?: Config) {
    if (!React.isValidElement(baseComponent)) {
      throw 'Invalid component. Try `Router()` instead of `Router`';
    }
    this._baseUrl = baseUrl;
    this._baseComponent = baseComponent;
    this._config = config;
  }

  getXML(): string {
    const paths = componentToPaths(this._baseComponent);
    return pathsToXml(this._baseUrl, paths, this._config);
  }

  save(path: string) {
    const paths = componentToPaths(this._baseComponent);
    const xml = pathsToXml(this._baseUrl, paths, this._config);
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

function pathsToXml(
  baseUrl: string,
  paths: Array<string>,
  config: ?Config
): string {
  const { lastmod, changefreq, priority } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

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
          loc: baseUrl + path,
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
