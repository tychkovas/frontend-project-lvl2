#!/usr/bin/env node
import commander from 'commander';
import { existsSync } from 'fs';
import genDiff from '../index.js';

const { program } = commander;

program
  .version('1.0.0', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'output usage information')
  .option('-f, --format [type]', 'output format');

program
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    if (existsSync(filepath1)) {
      if (existsSync(filepath2)) {
        const diff = genDiff(filepath1, filepath2);
        console.log(diff);
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
