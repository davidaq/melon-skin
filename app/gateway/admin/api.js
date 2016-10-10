import { hget, hgetall, hset, set, get, exists } from '../../util/redis';
import { c2p, hash } from '../../util';

export async function changePassword(vals) {
  const old = await hget('settings', 'admin:password');
  if (old && hash(vals.old) !== old) {
    throw '原始口令错误';
  }
  await hset('settings', 'admin:password', hash(vals.new));
}

export function restart() {
  setTimeout(() => process.exit(0), 100);
}

const settingsKeys = ['gateway:port', 'gateway:domain'];

export async function getSysSettings() {
  const ret = {};
  await Promise.all(settingsKeys.map(async key => {
    ret[key] = await hget('settings', key);
  }));
  ret['gateway:port'] -= 0;
  return ret;
}

export async function setSysSettings(vals) {
  await Promise.all(settingsKeys.map(async key => {
    const val = vals[key];
    if (typeof val !== 'undefined') {
      await hset('settings', key, val);
    }
  }));
}

export async function listRobots() {
  const list = (await hgetall('robot-info')) || {};
  const names = (await hgetall('robot-name')) || {};
  return await Promise.all(Object.keys(list).map(async key => {
    const item = JSON.parse(list[key]);
    item.online = !!await get(`robot-online:${key}`);
    item.name = names[key] || '';
    item.uuid = key;
    return item;
  }));
}
