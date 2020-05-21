#!/usr/bin/env node
import commander from 'commander';
import { existsSync } from 'fs';
import { extname, basename } from 'path';
import genDiff from '../index.js';

const { program } = commander;

program
  .version('1.0.1', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'output usage information')
  .option('-f, --format [type]', 'output format');

const availableFileFormats = ['.json', '.yml', '.ini'];

const isCorrectFilePath = (filepath) => {
  if (!existsSync(filepath)) {
    console.log(`error: file '${filepath}' does not exists`);
    return false;
  }
  const extnameFile = extname(filepath);
  if (!availableFileFormats.includes(extnameFile)) {
    console.log(`error: format file '${filepath}' does not available`);
    return false;
  }
  return true;
};

program
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    if (isCorrectFilePath(filepath1) && isCorrectFilePath(filepath2)) {
      const diff = genDiff(filepath1, filepath2);
      console.log(diff);
    }
  });

program.parse(process.argv);

if (program.vers) console.log(program.version());

if (program.format) console.log(` format type: ${program.format}`);
