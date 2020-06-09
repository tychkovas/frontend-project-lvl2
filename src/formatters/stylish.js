
const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmodified, add, deleted, nested, modified] = typesNode;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === deleted) return ' -';
  return '  '; // unmod && nested && mod
};

const parseDiffs = (node, spaceCnt) => {
  const { name, type } = node;
  const indent = ' '.repeat(spaceCnt);
  const sign = getSign(type);
  const nodeBegin = `${indent} ${sign} ${name}: {`;
  const nodeEnd = `${indent}    }`;

  if (type === modified) {
    const [valueAdd, valueDel] = node.node;
    const nodeAdd = parseDiffs(valueAdd, spaceCnt);
    const nodeDel = parseDiffs(valueDel, spaceCnt);
    return [nodeAdd, nodeDel].flat();
  }
  if (type === nested) {
    const { children } = node;
    const nodeValues = children.map((obj) => parseDiffs(obj, spaceCnt + tabSize));
    return [nodeBegin, nodeValues, nodeEnd].flat(2);
  }
  const { value } = node;
  if (typeof value === 'object') {
    const [key] = Object.keys(value);
    const nodeVal = parseDiffs({ name: key, type: unmodified, value: value[key] },
      spaceCnt + tabSize);
    return [nodeBegin, nodeVal, nodeEnd].flat();
  }
  if (type === add || deleted || unmodified) {
    return (`${indent} ${sign} ${name}: ${value}`);
  }
  throw new Error(`Unknown type of node: '${node.type}'!`);
};

const stylish = (diff) => {
  const textDiff = diff.map((obj) => parseDiffs(obj, 0))
    .flat().join('\n');
  return `{\n${textDiff}\n}`;
};

export default stylish;
