import Generator from '../lib/Generator';
import Router from './router/Router1';

it('Print xml', () => {
  const generator = new Generator('https://react-router-sitemap-generator.com', Router);
  const xml = generator.getXML();
  expect(xml).toEqual(['/generator', '/sitemap', '/router', '/react', '/']);
});
