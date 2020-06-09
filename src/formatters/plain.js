const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmodified, add, deleted, nested, modified] = typesNode;
const getPrintValue = (value) => (typeof value !== 'object' ? value : '[complex value]');

const makePlain = (diff) => {
  const getDiffs = (pathObj, obj) => {
    const parseDiffs = (path, node) => {
      const pathPrint = [...path, node.name].join('.');
      const { value } = node;
      switch (node.type) {
        case add: return `Property '${pathPrint}' was added with value: ${getPrintValue(value)}`;
        case deleted: return `Property '${pathPrint}' was deleted`;
        case modified: {
          const { node: [node1, node2] } = node;
          return `Property '${pathPrint}' was changed from ${getPrintValue(node1.value)} to ${getPrintValue(node2.value)}`;
        }
        case nested: {
          const { children } = node;
          return children.map((nestedObj) => getDiffs([...path, node.name], nestedObj))
            .flat();
        }
        case unmodified: return [];
        default: {
          throw new Error(`Unknown type of node: '${node.type}'!`);
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
