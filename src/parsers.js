import yaml from 'js-yaml';
import ini from 'ini';

const parse = (text, format) => {
  if (format === '.json') {
    return JSON.parse(text);
  }
  if (format === '.yml') {
    return yaml.safeLoad(text);
  }
  // if (format === '.ini') {
  return ini.parse(text);
};

export default parse;
