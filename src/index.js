import _ from 'lodash';
import fs from 'fs';

const compareConfig = (configBefore, configAfter) => {
  const keysBefore = Object.keys(configBefore);
  const keysAfter = Object.keys(configAfter);
  const unionKeys = _.union(keysBefore, keysAfter);

  const deletedAndModifiedKeys = keysBefore
    .filter((key) => configBefore[key] !== configAfter[key]);
  const unmodifiedKeys = keysAfter
    .filter((key) => configBefore[key] === configAfter[key]);
  const addedAndModifiedKeys = keysAfter
    .filter((key) => configAfter[key] !== configBefore[key]);

  const configChandges = unionKeys
    .map((key) => {
      if (unmodifiedKeys.includes(key)) {
        return `    ${key}: ${configAfter[key]}`;
      }
      const result = [];
      if (addedAndModifiedKeys.includes(key)) {
        result[0] = (`  + ${key}: ${configAfter[key]}`);
      }
      if (deletedAndModifiedKeys.includes(key)) {
        result[result.length] = (`  - ${key}: ${configBefore[key]}`);
      }
      return result;
    })
    .flat().join('\n');

  const textChandges = `\n{\n${configChandges}\n}`;

  return textChandges;
};

const genDiff = (pathToFile1, pathToFile2) => {
  const fileData1 = fs.readFileSync(pathToFile1, 'UTF-8', 'r');
  const fileDate2 = fs.readFileSync(pathToFile2, 'UTF-8', 'r');

  const config1 = JSON.parse(fileData1);
  const config2 = JSON.parse(fileDate2);

  const diffConfig = compareConfig(config1, config2);

  return diffConfig;
};

export default genDiff;
