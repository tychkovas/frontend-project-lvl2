import _ from 'lodash';
import fs from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getFormat from './formatters';

const stateDiff = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmod, add, del, nested, mod] = stateDiff;

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
      return { name: key, type: unmod, value: configAfter[key] };
    }
    if (deletedKeys.includes(key)) {
      return { name: key, type: del, value: configBefore[key] };
    }
    if (addedKeys.includes(key)) {
      return { name: key, type: add, value: configAfter[key] };
    }
    if (modifiedKeys.includes(key)) {
      if (typeof configAfter[key] === 'object'
       && typeof configBefore[key] === 'object') {
        const configMod = compareConfig(configBefore[key], configAfter[key]);
        return { name: key, type: nested, children: configMod };
      }
      const valueAdd = { name: key, type: add, value: configAfter[key] };
      const valueDel = { name: key, type: del, value: configBefore[key] };
      return { name: key, type: mod, nodes: [valueAdd, valueDel] };
    }
    return 'error return';
  });
  return configChandges;
};

const availableFormats = ['.json', '.yml', '.ini'];

const genDiff = (filepath1, filepath2, formatType) => {
  const format = getFormat(formatType);

  if (!fs.existsSync(filepath1)) return `error: file '${filepath1}' does not exists`;
  if (!fs.existsSync(filepath2)) return `error: file '${filepath2}' does not exists`;
  const formatFile1 = extname(filepath1);
  const formatFile2 = extname(filepath2);
  if (!availableFormats.includes(formatFile1)) return `error: format file '${filepath1}' does not available`;
  if (!availableFormats.includes(formatFile2)) return `error: format file '${filepath2}' does not available`;
  const fileData1 = fs.readFileSync(filepath1, 'UTF-8', 'r');
  const fileDate2 = fs.readFileSync(filepath2, 'UTF-8', 'r');

  const config1 = parse(fileData1, formatFile1);
  const config2 = parse(fileDate2, formatFile2);

  const diffConfig = compareConfig(config1, config2);
  const formattedDiff = format(diffConfig);
  return formattedDiff;
};

export default genDiff;
