
const tabSize = 4;

const getPrint = (element, depth) => {
  if (typeof element !== 'object') {
    return element;
  }
  const indent = ' '.repeat(depth * tabSize);
  const getEntry = (key, value) => `${indent}    ${key}: ${getPrint(value, depth + 1)}`;
  const keys = Object.keys(element);
  const entries = keys.map((key) => getEntry(key, element[key])).flat().join('\n');
  const result = `{\n${entries}\n${indent}}`;
  return result;
};

const buildTree = (diff, depth = 0) => {
  const parseDiffs = ({
    name, type, value, children, valueRemoved, valueAdded,
  }) => {
    const indent = ' '.repeat(depth * tabSize);
    switch (type) {
      case 'modified': {
        const elementAdd = `${indent}  + ${name}: ${getPrint(valueAdded, depth + 1)}`;
        const elementDeleted = `${indent}  - ${name}: ${getPrint(valueRemoved, depth + 1)}`;
        return `${elementAdd}\n${elementDeleted}`;
      }
      case 'nested': {
        const childrenTree = buildTree(children, depth + 1);
        return [`${indent}    ${name}: {`, childrenTree, `${indent}    }`].flat();
      }
      case 'add':
        return `${indent}  + ${name}: ${getPrint(value, depth + 1)}`;
      case 'deleted':
        return `${indent}  - ${name}: ${getPrint(value, depth + 1)}`;
      case 'unmodified':
        return `${indent}    ${name}: ${getPrint(value, depth + 1)}`;
      default:
        throw new Error(`Unknown type of node: '${type}'!`);
    }
  };
  const textDiff = diff.map(parseDiffs)
    .flat()
    .join('\n');
  return textDiff;
};

const stylish = (diff) => `{\n${buildTree(diff)}\n}`;

export default stylish;
