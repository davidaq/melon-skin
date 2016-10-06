import redis from 'redis';
import { c2p } from './async';

let R;

export function connect(uri) {
  R = redis.createClient(uri);
}

export const hget = (...args) => c2p(cb => R.hget(...args, cb));

export const set = (...args) => c2p(cb => R.set(...args, cb));
export const get = (...args) => c2p(cb => R.get(...args, cb));
export const exists = (...args) => c2p(cb => R.exists(...args, cb));
