import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => join(__dirname, '..', '__fixtures__', filename);

let pathFile1;
let pathFile2;
let pathDiff;
let fileDiff;
let diffData;

beforeAll(() => {
  pathFile1 = getFixturesPath('before.json');
  pathFile2 = getFixturesPath('after.json');
  pathDiff = getFixturesPath('diffBeforeAfter.txt');
  fileDiff = readFileSync(pathDiff, 'UTF-8', 'r');
  diffData = fileDiff.split('\n');
});

test('test function genDiff: example step 3', () => {
  const diffResult = genDiff(pathFile1, pathFile2);

  for (let i = 1; i < diffData.length; i += 1) {
    expect(diffResult).toMatch(diffData[i]);
  }
});
