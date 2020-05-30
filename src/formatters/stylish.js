
const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmod, add, del, nested, mod] = typesNode;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === del) return ' -';
  return '  '; // unmod && nested && mod
};

const parseDiffs = (node, spaceCnt) => {
  const { name, type } = node;
  const indent = ' '.repeat(spaceCnt);
  const sign = getSign(type);
  const nodeBegin = `${indent} ${sign} ${name}: {`;
  const nodeEnd = `${indent}    }`;

  if (type === mod) {
    const [valueAdd, valueDel] = node.nodes;
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
    const nodeVal = parseDiffs({ name: key, type: unmod, value: value[key] }, spaceCnt + tabSize);
    return [nodeBegin, nodeVal, nodeEnd].flat();
  }
  if (type === add || del || unmod) {
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
