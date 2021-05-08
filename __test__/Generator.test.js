import Generator from '../lib/Generator';
import Router from './data/Router1';
import fs from 'fs';

it('Print xml', () => {
  const generator = new Generator(
    'https://react-router-sitemap-generator.com',
    Router
  );
  const sitemap = fs.readFileSync('./__test__/data/sitemap1.xml').toString();
  expect(generator.getXML()).toEqual(sitemap);
});
