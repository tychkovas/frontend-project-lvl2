import _ from 'lodash';
import fs from 'fs';
import { extname } from 'path';
import parse from './parsers';

const stateDiff = ['unmodified', 'add', 'modified', 'deleted', 'nested'];
const [unmod, add, mod, del, nest] = stateDiff;

const compareConfig = (configBefore, configAfter) => {
  const keysBefore = Object.keys(configBefore);
  const keysAfter = Object.keys(configAfter);
  const unionKeys = _.union(keysBefore, keysAfter);
  const deletedKeys = keysBefore
    .filter((key) => !keysAfter.includes(key));
  const modifiedKeys = keysBefore
    .filter((key) => !deletedKeys.includes(key))
    .filter((key) => configBefore[key] !== configAfter[key]);
  const unmodifiedKeys = keysAfter
    .filter((key) => configBefore[key] === configAfter[key]);
  const addedKeys = keysAfter
    .filter((key) => !keysBefore.includes(key));
  const configChandges = unionKeys.map((key) => {
    if (unmodifiedKeys.includes(key)) {
      return { [key]: [unmod, configAfter[key], null] };
    }
    if (deletedKeys.includes(key)) {
      return { [key]: [del, configBefore[key], null] };
    }
    if (addedKeys.includes(key)) {
      return { [key]: [add, configAfter[key], null] };
    }
    if (modifiedKeys.includes(key)) {
      if (typeof configAfter[key] === 'object'
       && typeof configBefore[key] === 'object') {
        const configMod = compareConfig(configBefore[key], configAfter[key]);
        return { [key]: [nest, configMod, null] };
      }
      return { [key]: [mod, configAfter[key], configBefore[key]] };
    }
    return 'error return';
  });
  return configChandges;
};

const genDiff = (pathToFile1, pathToFile2) => {
  const formatFile1 = extname(pathToFile1);
  const formatFile2 = extname(pathToFile2);
  const fileData1 = fs.readFileSync(pathToFile1, 'UTF-8', 'r');
  const fileDate2 = fs.readFileSync(pathToFile2, 'UTF-8', 'r');

  const config1 = parse(fileData1, formatFile1);
  const config2 = parse(fileDate2, formatFile2);

  const diffConfig = compareConfig(config1, config2);

  return diffConfig;
};

export default genDiff;
