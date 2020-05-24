
const stateDiff = ['unmodified', 'add', 'modified', 'deleted', 'nested'];
const [unmod, add, mod, del, nest] = stateDiff;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === del) return ' -';
  if (curStatus === mod) return ' +';
  if (curStatus === unmod) return '  ';
  if (curStatus === nest) return '  ';
  return 'not status';
};

const parseDiffs = (key, data, spaceCnt) => {
  const getDiff = (obj) => {
    const [keyObj] = Object.keys(obj);
    const valueObj = obj[keyObj];
    const resultObj = parseDiffs(keyObj, valueObj, spaceCnt + tabSize);
    return resultObj;
  };

  let [state, value1, value2] = [null, null, null];
  if (Array.isArray(data)) {
    [state, value1, value2] = data;
  } else {
    [state, value1, value2] = [unmod, data, null];
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

  if (value2 !== null) {
    result = parseDiffs(key, [del, value2, null], spaceCnt);
    lines.push(result);
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
