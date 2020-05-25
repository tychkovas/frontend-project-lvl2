
const stateDiff = ['unmodified', 'add', 'deleted', 'nested'];
const [unmod, add, del, nest] = stateDiff;
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

  let [state, value1] = [null, null];
  if (Array.isArray(data)) {
    [state, value1] = data;
  } else {
    [state, value1] = [unmod, data];
  }

  const lines = [];
  const indent = ' '.repeat(spaceCnt);
  const sign = getSign(state);
  let result;

  if (typeof value1 === 'object') {
    lines.push(`${indent} ${sign} ${key}: {`);

    if (state === nest) {
      result = value1.map(getDiff);
      lines.push(result);
    } else {
      const [value1Key] = Object.keys(value1);
      result = parseDiffs(value1Key, value1[value1Key], spaceCnt + tabSize);
      lines.push(result);
    }

    lines.push(`${indent}    }`);
  } else {
    lines.push(`${indent} ${sign} ${key}: ${value1}`);
  }
  return lines.flat(2);
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
