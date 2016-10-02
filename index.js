const fs = require('fs');
const path = require('path');

const target = process.argv[2] || '';
if (['master', 'worker', 'test', 'help'].indexOf(target) === -1) {
  console.error('Invalid command');
  process.exit(1);
}
fs.readFile(path.join(__dirname, '.babelrc'), 'utf-8', (err, content) => {
  require('babel-register')(JSON.parse(content));
  require('./app/' + target).default(process.argv.slice(3));
});
