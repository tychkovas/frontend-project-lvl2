
const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmodified, add, deleted, nested, modified] = typesNode;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === deleted) return ' -';
  return '  '; // unmod && nested && mod
};

const buildTree = (diff, spacesCount) => {
  const parseDiffs = ({
    name, type, value, children, node,
  }, spaces) => {
    const indent = ' '.repeat(spaces);
    const sign = getSign(type);
    const nodeBegin = `${indent} ${sign} ${name}: {`;
    const nodeEnd = `${indent}    }`;
    if (typeof value === 'object') {
      const [key] = Object.keys(value);
      const nodeVal = parseDiffs({ name: key, type: unmodified, value: value[key] },
        spaces + tabSize);
      return [nodeBegin, nodeVal, nodeEnd].flat();
    }
    switch (type) {
      case modified: {
        const [valueAdd, valueDel] = node;
        const nodeAdd = parseDiffs(valueAdd, spaces);
        const nodeDel = parseDiffs(valueDel, spaces);
        return [nodeAdd, nodeDel].flat();
      }
      case nested: {
        const nodeValues = buildTree(children, spaces + tabSize);
        return [nodeBegin, nodeValues, nodeEnd].flat(2);
      }
      case add:
      case deleted:
      case unmodified:
      {
        return (`${indent} ${sign} ${name}: ${value}`);
      }
      default: {
        throw new Error(`Unknown type of node: '${node.type}'!`);
      }
    }
  };

  const textDiff = diff.map((obj) => parseDiffs(obj, spacesCount))
    .flat().join('\n');
  return textDiff;
};

const stylish = (diff) => `{\n${buildTree(diff, 0)}\n}`;
export default stylish;
