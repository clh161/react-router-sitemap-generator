//@flow strict

import Generator from '../src/Generator';
import Router from './data/Router';
import fs from 'fs';

it('Print xml', () => {
  const generator = new Generator(
    'https://react-router-sitemap-generator.com',
    Router(),
    { lastmod: '2021-01-01' }
  );
  const sitemap = fs.readFileSync('./__test__/data/sitemap.xml').toString();
  expect(generator.getXML()).toEqual(sitemap);
});

it('Invalid Component', () => {
  [123, '123', () => {}, Router].forEach((component) => {
    expect(() => new Generator('', component)).toThrow(
      'Invalid component. Try `Router()` instead of `Router`'
    );
  });
});

it('Invalid Component', () => {
  [123, '123', () => {}, Router].forEach((component) => {
    expect(() => new Generator('', component)).toThrow(
      'Invalid component. Try `Router()` instead of `Router`'
    );
  });
});
