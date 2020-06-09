import _ from 'lodash';
import fs from 'fs';
import { extname } from 'path';
import parse from './parsers';
import getFormat from './formatters';

const typesNode = ['unmodified', 'add', 'deleted', 'nested', 'modified'];
const [unmodified, add, deleted, nested, modified] = typesNode;

const compareConfig = (configBefore, configAfter) => {
  const unionKeys = _.union(Object.keys(configBefore), Object.keys(configAfter));
  const configChandges = unionKeys.map((key) => {
    const value1 = configBefore[key];
    const value2 = configAfter[key];
    if (!_.has(configAfter, key)) {
      return { name: key, type: deleted, value: value1 };
    }
    if (!_.has(configBefore, key)) {
      return { name: key, type: add, value: value2 };
    }
    if (value1 === value2) {
      return { name: key, type: unmodified, value: value2 };
    }
    if (typeof value2 === 'object' && typeof value1 === 'object') {
      const configMod = compareConfig(value1, value2);
      return { name: key, type: nested, children: configMod };
    }
    const valueAdd = { name: key, type: add, value: value2 };
    const valueDel = { name: key, type: deleted, value: value1 };
    return { name: key, type: modified, node: [valueAdd, valueDel] };
  });
  return configChandges;
};

const availableFormats = ['json', 'yml', 'yaml', 'ini'];

const genDiff = (filepath1, filepath2, formatType) => {
  const format = getFormat(formatType);
  const formatFile1 = extname(filepath1).substr(1);
  const formatFile2 = extname(filepath2).substr(1);
  if (!availableFormats.includes(formatFile1)) throw new Error(`error: format file '${filepath1}' does not available`);
  if (!availableFormats.includes(formatFile2)) throw new Error(`error: format file '${filepath2}' does not available`);
  const fileData1 = fs.readFileSync(filepath1, 'UTF-8');
  const fileDate2 = fs.readFileSync(filepath2, 'UTF-8');

  const config1 = parse(fileData1, formatFile1);
  const config2 = parse(fileDate2, formatFile2);

  const diffConfig = compareConfig(config1, config2);
  return format(diffConfig);
};

export default genDiff;
