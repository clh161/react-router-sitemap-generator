import Generator from "../lib/Generator";

it('Print xml', () => {
    const generator = new Generator('https://react-router-sitemap-generator.com')
    const xml = generator.getXML();
    expect(xml).toEqual('https://react-router-sitemap-generator.com')
  }
)
