import _ from 'lodash';
import stylish from './stylish';
import plain from './plain';
import json from './json';

const formats = {
  stylish: (diff) => stylish(diff),
  plain: (diff) => plain(diff),
  json: (diff) => json(diff, null, 2),
};

const getFormat = (type) => {
  if (!_.has(formats, type)) {
    throw new Error('error: format type does not exists');
  }
  return formats[type];
};

export default getFormat;
