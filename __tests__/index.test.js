import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => join(__dirname, '..', '__fixtures__', filename);

let pathFile1;
let pathFile2;

let pathDiff;
let diffData;

const pairsFilePath = [
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
];

const pathDiffFiles = {
  stylish: 'diff-stylish.txt',
  plain: 'diff-plain.txt',
  json: 'diff-json.json',
};

describe.each(['stylish', 'plain', 'json'])('test dinDiff', (format) => {
  beforeEach(() => {
    pathDiff = getFixturesPath(pathDiffFiles[format]);
    diffData = readFileSync(pathDiff, 'UTF-8');
  });
  test.each(pairsFilePath)(`format ${format} for file %s from file %s `, (path1, path2) => {
    pathFile1 = getFixturesPath(path1);
    pathFile2 = getFixturesPath(path2);
    const diffResult = genDiff(pathFile1, pathFile2, format);
    expect(diffResult).toBe(diffData);
  });
});
