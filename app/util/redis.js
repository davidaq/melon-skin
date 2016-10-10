import redis from 'redis';
import { c2p } from './async';

let R;

exports.connect = uri => {
  R = redis.createClient(uri);
};

[
  'hget', 'hset', 'hgetall',
  'set', 'get', 'setnx', 'exists',
  'linsert', 'rpop', 'brpop',
].forEach(cmd => {
  exports[cmd] = (...args) => c2p(cb => R[cmd](...args, cb));
});
