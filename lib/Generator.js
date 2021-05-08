export default class Generator {
  _paths = []

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
        const { children, path } = props;
        children?.forEach((child) => {
          components.push(child);
        });
        if (path != null) {
          this._paths.push(path);
        }
      }
    }
  }

  getXML() {
    this._generate();
    return this._paths;
  }
}
