#!/usr/bin/env node
import commander from 'commander';
import genDiff from '../index.js';

const { program } = commander;

program
  .version('1.0.1', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish');

program
  .arguments('<filepath1> <filepath2> [format]')
  .action((filepath1, filepath2) => {
    const diff = genDiff(filepath1, filepath2, program.format);
    console.log(diff);
  });

program.parse(process.argv);

if (program.vers) console.log(program.version());
