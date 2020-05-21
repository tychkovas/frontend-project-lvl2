import yaml from 'js-yaml';

const parse = (text, format) => {
  if (format === '.json') {
    return JSON.parse(text);
  }
  if (format === '.yml') {
    return yaml.safeLoad(text);
  }
};

export default parse;
