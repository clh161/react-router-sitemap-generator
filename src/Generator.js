// @flow strict

const fs = require('fs');
const convertor = require('xml-js');
import type { MixedElement } from 'react';
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
  _baseComponent: MixedElement;
  _config: ?Config;

  constructor(baseUrl: string, baseComponent: MixedElement, config?: Config) {
    if (!React.isValidElement(baseComponent)) {
      throw 'Invalid component. Try `Router()` instead of `Router`';
    }
    this._baseUrl = baseUrl;
    this._baseComponent = baseComponent;
    this._config = config;
  }

  getXML(): string {
    const paths = componentToPaths(this._baseComponent, this._baseUrl);
    return pathsToXml(this._baseUrl, paths, this._config);
  }

  save(path: string) {
    const paths = componentToPaths(this._baseComponent, this._baseUrl);
    const xml = pathsToXml(this._baseUrl, paths, this._config);
    fs.writeFileSync(path, xml);
  }
}

function componentToPaths(
  _baseComponent: MixedElement,
  baseURL: string
): Array<URL> {
  const paths: Array<URL> = [];
  const components: Array<any> = [_baseComponent];
  while (components.length !== 0) {
    const component = components.pop();
    if (!React.isValidElement(component)) continue;
    const { props } = component;
    if (props == null) continue;
    const { path, component: propsComponents } = props;
    React.Children.forEach(
      component?.props?.children,
      (child: MixedElement) => {
        components.push(child);
      }
    );
    if (component.type.name === 'Route') {
      if (path != null) {
        paths.push(new URL(path, baseURL));
      }
      if (typeof propsComponents === 'function') {
        components.push(propsComponents({ match: { url: path } }));
      }
    }
  }
  return paths;
}

function pathsToXml(
  baseUrl: string,
  paths: Array<URL>,
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
          loc: path.href,
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
