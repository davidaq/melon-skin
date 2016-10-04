const fs = require('fs');
const path = require('path');

if (process.env.DEBUG) {
  global.DEBUG = true;
} else {
  global.DEBUG = false;
}

const target = process.argv[2] || '';
if (['master', 'robot', 'gateway', 'test', 'help'].indexOf(target) === -1) {
  console.error('Invalid command');
  process.exit(1);
}
fs.readFile(path.join(__dirname, '.babelrc'), 'utf-8', (err, content) => {
  require('babel-register')(JSON.parse(content));
  require('./app/' + target).default(process.argv.slice(3));
});
