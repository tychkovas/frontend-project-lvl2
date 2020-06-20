
const tabSize = 4;

const getPrint = (element, spacesCount) => {
  if (typeof element !== 'object') {
    return element;
  }
  const getEntry = (key, value) => `${' '.repeat(spacesCount)}    ${key}: ${getPrint(value, spacesCount + tabSize)}`;
  const keys = Object.keys(element);
  const entries = keys.map((key) => getEntry(key, element[key])).flat().join('\n');
  const result = `{\n${entries}\n${' '.repeat(spacesCount)}}`;
  return result;
};

const buildTree = (diff, spacesCount = 0) => {
  const parseDiffs = ({
    name, type, value, children, valueDeleted, valueAdd,
  }) => {
    const indent = ' '.repeat(spacesCount);
    switch (type) {
      case 'modified': {
        const elementAdd = `${indent}  + ${name}: ${getPrint(valueAdd, spacesCount + tabSize)}`;
        const elementDeleted = `${indent}  - ${name}: ${getPrint(valueDeleted, spacesCount + tabSize)}`;
        return `${elementAdd}\n${elementDeleted}`;
      }
      case 'nested': {
        const childrenTree = buildTree(children, spacesCount + tabSize);
        return [`${indent}    ${name}: {`, childrenTree, `${indent}    }`].flat();
      }
      case 'add':
        return `${indent}  + ${name}: ${getPrint(valueAdd, spacesCount + tabSize)}`;
      case 'deleted':
        return `${indent}  - ${name}: ${getPrint(valueDeleted, spacesCount + tabSize)}`;
      case 'unmodified':
        return `${indent}    ${name}: ${getPrint(value, spacesCount + tabSize)}`;
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
