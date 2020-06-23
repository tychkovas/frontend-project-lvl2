const getPrint = (value) => (typeof value !== 'object' ? value : '[complex value]');

const makePlain = (diff, rootPath = '') => {
  const getDiffs = (obj) => {
    const parseDiffs = (path, {
      name, type, children, value, valueRemoved, valueAdded,
    }) => {
      const pathPrint = [path, name].filter((x) => x !== '').join('.');
      switch (type) {
        case 'add':
          return `Property '${pathPrint}' was added with value: ${getPrint(value)}`;
        case 'deleted':
          return `Property '${pathPrint}' was deleted`;
        case 'modified':
          return `Property '${pathPrint}' was changed from ${getPrint(valueRemoved)} to ${getPrint(valueAdded)}`;
        case 'nested':
          return makePlain(children, pathPrint);
        case 'unmodified':
          return [];
        default:
          throw new Error(`Unknown type of node: '${type}'!`);
      }
    };
    return parseDiffs(rootPath, obj);
  };
  const textDiff = diff.map((obj) => getDiffs(obj))
    .flat()
    .join('\n');
  return textDiff;
};

export default makePlain;
