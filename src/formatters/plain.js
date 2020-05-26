const stateDiff = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [, add, del, nest, mod] = stateDiff;
const outValue = (value) => (typeof value !== 'object' ? value : '[complex value]');

const plain = (diff) => {
  const getDiffs = (pathKeys, obj) => {
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
        const result = value.map((nestedObj) => getDiffs(keys, nestedObj))
          .flat(1);
        return result;
      }
      return []; // if (state === unmod)
    };
    const [key] = Object.keys(obj);
    const result = parseDiffs([...pathKeys, key], obj[key]);
    return result;
  };
  const textDiff = diff.map((obj) => getDiffs([], obj))
    .flat()
    .join('\n');
  const text = `${textDiff}`;
  return text;
};

export default plain;
