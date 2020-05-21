import yaml from 'js-yaml';

const parse = (text, format) => {
  let result;
  if (format === 'json') {
    result = JSON.parse(text);
  }
  if (format === 'yml') {
    result = yaml.safeLoad(text);
  }
  return result;
};

export default parse;
