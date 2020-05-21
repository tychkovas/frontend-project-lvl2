#!/usr/bin/env node
import commander from 'commander';
import { existsSync } from 'fs';
import genDiff from '../index.js';

const { program } = commander;

program
  .version('1.0.1', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'output usage information')
  .option('-f, --format [type]', 'output format');

const availableFileFormats = ['json', 'yml'];

program
  .arguments('<filepath1> <filepath2> <fileformat>')
  .action((filepath1, filepath2, fileformat) => {
    if (existsSync(filepath1)) {
      if (existsSync(filepath2)) {
        if (availableFileFormats.includes(fileformat)) {
          const diff = genDiff(filepath1, filepath2, fileformat);
          console.log(diff);
        } else {
          console.log(`error: format '${fileformat}' does not available`);
        }
      } else {
        console.log(`error: file '${filepath2}' does not exists`);
      }
    } else {
      console.log(`error: file '${filepath1}' does not exists`);
    }
  });

program.parse(process.argv);

if (program.vers) console.log(program.version());

if (program.format) console.log(` format type: ${program.format}`);
