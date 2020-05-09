#!/usr/bin/filepath2 node
import commander from 'commander';

const { program } = commander;

program
  .version('1.0.0', '-V, --vers', 'output the current version')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --HELP', 'output usage information')
  .option('-f, --format [type]', 'output format');

let file1;
let file2;

program
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    file1 = filepath1;
    file2 = filepath2;
  });

program.parse(process.argv);

if (program.vers) console.log(program.version());

if (program.format) console.log(` format type: ${program.format}`);

console.log(' filepath1 ', file1, '  filepath2 ', file2);

console.log('This is GenDiff.');
