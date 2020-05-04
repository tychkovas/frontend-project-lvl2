#!/usr/bin/env node
import commander from 'commander';

const { program } = commander;

program
  .version('1.0.0', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'read more information');

program.parse(process.argv);

if (program.vers) console.log(program.version());

console.log('This is GenDiff.');
