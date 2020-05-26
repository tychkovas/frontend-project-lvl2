import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => join(__dirname, '..', '__fixtures__', filename);

let pathFile1;
let pathFile2;

let pathDiff;
let fileDiff;
let diffData;

const pairsFilePath = [
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
];
const formats = ['stylish', 'plain'];
const pathDiffFiles = {
  stylish: 'diff-stylish.txt',
  plain: 'diff-plain.txt',
};

describe.each(formats)('test dinDiff', (format) => {
  beforeEach(() => {
    pathDiff = getFixturesPath(pathDiffFiles[format]);
    fileDiff = readFileSync(pathDiff, 'UTF-8', 'r');
    diffData = fileDiff.split('\n');
  });
  test.each(pairsFilePath)(`format ${format} for file %s from file %s `, (path1, path2) => {
    pathFile1 = getFixturesPath(path1);
    pathFile2 = getFixturesPath(path2);
    const diffResult = genDiff(pathFile1, pathFile2, format);
    for (let i = 1; i < diffData.length; i += 1) {
      expect(diffResult).toMatch(diffData[i]);
    }
  });
});
