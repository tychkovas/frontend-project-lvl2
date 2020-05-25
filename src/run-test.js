import genDiff from './index.js';

const path1 = './__fixtures__/before.json';
const path2 = './__fixtures__/after.json';

const diff = genDiff(path1, path2, 'stylish');
console.log('diff: ', diff);
