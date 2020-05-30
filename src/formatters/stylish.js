
const stateDiff = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmod, add, del, nested, mod] = stateDiff;
const tabSize = 4;

const getSign = (curStatus) => {
  if (curStatus === add) return ' +';
  if (curStatus === del) return ' -';
  return '  '; // unmod && nest
};

const parseDiffs = (node, spaceCnt) => {
  const getDiff = (obj) => {
    const resultObj = parseDiffs(obj, spaceCnt + tabSize);
    return resultObj;
  };
  const key = node.name;
  const state = node.type;
  const indent = ' '.repeat(spaceCnt);
  const sign = getSign(state);

  if (state === mod) {
    // const { nodes } = node;
    const [valueAdd, valueDel] = node.nodes;
    const nodeAdd = parseDiffs(valueAdd, spaceCnt);
    const nodeDel = parseDiffs(valueDel, spaceCnt);
    return [nodeAdd, nodeDel].flat(3);
  }
  const nodeBegin = `${indent} ${sign} ${key}: {`;
  const nodeEnd = `${indent}    }`;

  if (state === nested) {
    // const nodeBegin = `${indent} ${sign} ${key}: {`;
    // const nodeEnd = `${indent}    }`;
    const { children } = node;
    const nodeValues = children.map(getDiff);
    const result = [nodeBegin, nodeValues, nodeEnd].flat(3);
    return result;
  }
  // if (state === add)
  const { value } = node;
  if (typeof value === 'object') {
    // const nodeBegin = `${indent} ${sign} ${key}: {`;
    // const nodeEnd = `${indent}    }`;
    const [vKey] = Object.keys(value);
    const nodeVal = parseDiffs({ name: vKey, type: unmod, value: value[vKey] }, spaceCnt + tabSize);
    const resultObj = [nodeBegin, nodeVal, nodeEnd].flat(3);
    return resultObj;
  }
  return (`${indent} ${sign} ${key}: ${value}`);
};

const stylish = (diff) => {
  // console.log('diff: ', diff);
  // console.log(' ---------==============-----------');
  const textDiff = diff.map((obj) => {
    const result = parseDiffs(obj, 0);
    return result;
  })
    .flat().join('\n');
  const text = `\n{\n${textDiff}\n}`;
  return text;
};

export default stylish;

// const parseDiffs = (node, spaceCnt) => {
//   const getDiff = (obj) => {
//     const resultObj = parseDiffs(obj, spaceCnt + tabSize);
//     return resultObj;
//   };
//   const key = node.name;
//   const state = node.type;
//   const lines = [];
//   const indent = ' '.repeat(spaceCnt);
//   const sign = getSign(state);

//   if (state === mod) {
//     const { value } = node;
//     const [valueAdd, valueDel] = value;
//     const nodeAdd = parseDiffs(valueAdd, spaceCnt);
//     const nodeDel = parseDiffs(valueDel, spaceCnt);
//     return [nodeAdd, nodeDel];
//   }

//   if (state === nested) {
//     const nodeBegin = `${indent} ${sign} ${key}: {`;
//     const nodeEnd = (`${indent}    }`;
//   };
//   if (typeof value === 'object') {
//     lines.push(`${indent} ${sign} ${key}: {`);

//     if (state === nested) {
//       result = value.map(getDiff);
//       lines.push(result);
//     } else {
//       const [value1Key] = Object.keys(value);
//       result = parseDiffs(value1Key, value[value1Key], spaceCnt + tabSize);
//       lines.push(result);
//     }

//     lines.push(`${indent}    }`);
//   } else {
//     lines.push(`${indent} ${sign} ${key}: ${value}`);
//   }
//   return lines.flat(3);
// };
