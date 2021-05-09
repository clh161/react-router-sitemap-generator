//@flow strict

import Generator from '../src/Generator';
import Router from './data/Router';
import fs from 'fs';

it('Print xml', () => {
  const generator = new Generator(
    'https://react-router-sitemap-generator.com',
    Router()
  );
  const sitemap = fs.readFileSync('./__test__/data/sitemap.xml').toString();
  expect(generator.getXML()).toEqual(sitemap);
});
