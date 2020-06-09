const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmodified, add, deleted, nested, modified] = typesNode;
const outValue = (value) => (typeof value !== 'object' ? value : '[complex value]');

const makePlain = (diff) => {
  const getDiffs = (pathObj, obj) => {
    const parseDiffs = (path, node) => {
      const pathPrint = [...path, node.name].join('.');
      const { value } = node;
      if (node.type === add) {
        return `Property '${pathPrint}' was added with value: ${outValue(value)}`;
      }
      if (node.type === deleted) {
        return `Property '${pathPrint}' was deleted`;
      }
      if (node.type === modified) {
        const { node: [node1, node2] } = node;
        return `Property '${pathPrint}' was changed from ${outValue(node1.value)} to ${outValue(node2.value)}`;
      }
      if (node.type === nested) {
        const { children } = node;
        return children.map((nestedObj) => getDiffs([...path, node.name], nestedObj))
          .flat();
      }
      if (node.type === unmodified) {
        return [];
      }
      throw new Error(`Unknown type of node: '${node.type}'!`);
    };
    return parseDiffs(pathObj, obj);
  };
  const rootPath = [];
  const textDiff = diff.map((obj) => getDiffs(rootPath, obj))
    .flat()
    .join('\n');
  return `${textDiff}`;
};

export default makePlain;
