import { join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => join(__dirname, '..', '__fixtures__', filename);

let pathFile1;
let pathFile2;
let pathDiffStylish;
let fileDiffStylish;
let diffDataStylish;
let pathDiffPlain;
let fileDiffPlain;
let diffDataPlain;

const pairsFilePath = [
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
];

beforeAll(() => {
  pathDiffStylish = getFixturesPath('diff-stylish.txt');
  fileDiffStylish = readFileSync(pathDiffStylish, 'UTF-8', 'r');
  diffDataStylish = fileDiffStylish.split('\n');

  pathDiffPlain = getFixturesPath('diff-plain.txt');
  fileDiffPlain = readFileSync(pathDiffPlain, 'UTF-8', 'r');
  diffDataPlain = fileDiffPlain.split('\n');
});

test.each(pairsFilePath)('test genDiff stylish format file %s from file %s ', (path1, path2) => {
  pathFile1 = getFixturesPath(path1);
  pathFile2 = getFixturesPath(path2);
  const diffResult = genDiff(pathFile1, pathFile2, 'stylish');
  for (let i = 1; i < diffDataStylish.length; i += 1) {
    expect(diffResult).toMatch(diffDataStylish[i]);
  }
});

test.each(pairsFilePath)('test genDiff plain format file %s from file %s', (path1, path2) => {
  pathFile1 = getFixturesPath(path1);
  pathFile2 = getFixturesPath(path2);
  const diffResult = genDiff(pathFile1, pathFile2, 'plain');
  for (let i = 1; i < diffDataPlain.length; i += 1) {
    expect(diffResult).toMatch(diffDataPlain[i]);
  }
});