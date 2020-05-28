import genDiff from './index.js';

const path1 = './__fixtures__/before.json';
const path2 = './__fixtures__/after.json';

const diff = genDiff(path1, path2, 'stylish');
console.log(diff);
console.log('    --------=====plain=========---------');
const diffPlain = genDiff(path1, path2, 'plain');
console.log(diffPlain);
console.log('    --------=====json=========---------');
const diffJson = genDiff(path1, path2, 'json');
console.log(diffJson);
