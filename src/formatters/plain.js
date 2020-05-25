const stateDiff = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [, add, del, nest, mod] = stateDiff;
const outValue = (value) => (typeof value !== 'object' ? value : '[complex value]');

const parseDiffs = (keys, data) => {
  const [state, value] = data;
  const path = keys.join('.');
  if (state === add) {
    return `Property '${path}' was added with value: ${outValue(value)}`;
  }
  if (state === del) {
    return `Property '${path}' was deleted`;
  }
  if (state === mod) {
    const [value1, value2] = value;
    return `Property '${path}' was changed from ${outValue(value1)} to ${outValue(value2)}`;
  }
  if (state === nest) {
    const result = value.map((obj) => {
      const [key] = Object.keys(obj);
      const resultParse = parseDiffs([...keys, key], obj[key]);
      return resultParse;
    }).flat(1);
    return result;
  }
  return []; // if (state === unmod)
};

const plain = (diff) => {
  const textDiff = diff.map((obj) => {
    const [key] = Object.keys(obj);
    const result = parseDiffs([key], obj[key]);
    return result;
  })
    .flat().join('\n');
  const text = `${textDiff}`;
  return text;
};

export default plain;
