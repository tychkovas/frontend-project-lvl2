const getPrint = (value) => (typeof value !== 'object' ? value : '[complex value]');

const makePlain = (diff) => {
  const getDiffs = (pathObj, obj) => {
    const parseDiffs = (path, {
      name, type, value, children,
    }) => {
      const pathPrint = [...path, name].join('.');
      switch (type) {
        case 'add': return `Property '${pathPrint}' was added with value: ${getPrint(value)}`;
        case 'deleted': return `Property '${pathPrint}' was deleted`;
        case 'modified': {
          const [node1, node2] = value;
          return `Property '${pathPrint}' was changed from ${getPrint(node1.value)} to ${getPrint(node2.value)}`;
        }
        case 'nested': {
          return children.map((nestedObj) => getDiffs([...path, name], nestedObj))
            .flat();
        }
        case 'unmodified': return [];
        default: {
          throw new Error(`Unknown type of node: '${type}'!`);
        }
      }
    };
    return parseDiffs(pathObj, obj);
  };
  const rootPath = [];
  const textDiff = diff.map((obj) => getDiffs(rootPath, obj))
    .flat()
    .join('\n');
  return textDiff;
};

export default makePlain;
