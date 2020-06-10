
const tabSize = 4;

const getPrint = (element, spaces) => {
  if (typeof element !== 'object') {
    return element;
  }
  const func = (key, value) => `${' '.repeat(spaces)}    ${key}: ${getPrint(value, spaces + tabSize)}`;
  const keys = Object.keys(element);
  const entries = keys.map((key) => func(key, element[key])).flat().join('\n');
  const result = `{\n${entries}\n${' '.repeat(spaces)}}`;
  return result;
};

const buildTree = (diff, spacesCount) => {
  const parseDiffs = ({
    name, type, value, children,
  }) => {
    const indent = ' '.repeat(spacesCount);
    switch (type) {
      case 'modified': {
        return value.map((element) => parseDiffs(element, spacesCount));
      }
      case 'nested': {
        const nodeValues = buildTree(children, spacesCount + tabSize);
        return [`${indent}    ${name}: {`, nodeValues, `${indent}    }`].flat();
      }
      case 'add': {
        return (`${indent}  + ${name}: ${getPrint(value, spacesCount + tabSize)}`);
      }
      case 'deleted': {
        return (`${indent}  - ${name}: ${getPrint(value, spacesCount + tabSize)}`);
      }
      case 'unmodified': {
        return (`${indent}    ${name}: ${getPrint(value, spacesCount + tabSize)}`);
      }
      default: {
        throw new Error(`Unknown type of node: '${type}'!`);
      }
    }
  };
  const textDiff = diff.map(parseDiffs)
    .flat()
    .join('\n');
  return textDiff;
};

const stylish = (diff) => `{\n${buildTree(diff, 0)}\n}`;

export default stylish;
