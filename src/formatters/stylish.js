
const stateDiff = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmod, add, del, nest, mod] = stateDiff;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === del) return ' -';
  return '  '; // unmod && nest
};

const parseDiffs = (key, data, spaceCnt) => {
  const getDiff = (obj) => {
    const [keyObj] = Object.keys(obj);
    const valueObj = obj[keyObj];
    const resultObj = parseDiffs(keyObj, valueObj, spaceCnt + tabSize);
    return resultObj;
  };

  let [state, value] = [null, null];
  if (Array.isArray(data)) {
    [state, value] = data;
  } else {
    [state, value] = [unmod, data];
  }

  const lines = [];
  const indent = ' '.repeat(spaceCnt);
  const sign = getSign(state);
  let result;

  if (state === mod) {
    const [valueAdd, valueDel] = value;
    parseDiffs(key, [add, valueAdd], spaceCnt);
    parseDiffs(key, [del, valueDel], spaceCnt);
  }
  if (state === mod) {
    const [valueAdd, valueDel] = value;
    return [parseDiffs(key, [add, valueAdd], spaceCnt), parseDiffs(key, [del, valueDel], spaceCnt)];
  }
  if (typeof value === 'object') {
    lines.push(`${indent} ${sign} ${key}: {`);

    if (state === nest) {
      result = value.map(getDiff);
      lines.push(result);
    } else {
      const [value1Key] = Object.keys(value);
      result = parseDiffs(value1Key, value[value1Key], spaceCnt + tabSize);
      lines.push(result);
    }

    lines.push(`${indent}    }`);
  } else {
    lines.push(`${indent} ${sign} ${key}: ${value}`);
  }
  return lines.flat(3);
};

const stylish = (diff) => {
  const textDiff = diff.map((obj) => {
    const [key] = Object.keys(obj);
    const result = parseDiffs(key, obj[key], 0);
    return result;
  })
    .flat().join('\n');
  const text = `\n{\n${textDiff}\n}`;
  return text;
};

export default stylish;
