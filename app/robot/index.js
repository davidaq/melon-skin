import { connect, brpop, rpop, linsert, hset, get, set, setnx } from '../util/redis';
import { c2p, catched, hash } from '../util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as UUID } from 'node-uuid';

export default catched(async function (argv) {
  connect(argv[0]);
  const fingerPrintPath = path.join(os.homedir(), '.melon-skin');
  let fingerPrint;
  try {
    fingerPrint = await c2p(cb => fs.readFile(fingerPrintPath, 'utf-8', cb));
  } catch (err) {
    console.error(err.stack);
  }
  if (!fingerPrint) {
    fingerPrint = UUID();
    await c2p(cb => fs.writeFile(fingerPrintPath, fingerPrint, cb));
  }
  const onlineKey = `robot-online:${fingerPrint}`;
  if (!await setnx(onlineKey, process.pid)) {
    const prevPid = await get(onlineKey);
    try {
      if (process.kill(prevPid, 0)) {
        console.error('duplicate connection');
        process.exit(0);
      }
      return;
    } catch (err) {
    }
    console.log('previous instance not alive');
  }
  set(onlineKey, process.pid, 'EX', 60);
  setInterval(() => {
    set(onlineKey, process.pid, 'EX', 60);
  }, 50000).unref();
  const interfaces = os.networkInterfaces();
  const ip = [];
  ['WLAN', 'eth0', 'eth1', 'eth2', 'eth3', 'eth4'].forEach(key => {
    const group = interfaces[key];
    if (group) {
      group.forEach(item => {
        if (!item.internal && item.family === 'IPv4') {
          ip.push(item.address);
        }
      });
    }
  });
  await hset('robot-info', fingerPrint, JSON.stringify({
    hostName: os.hostname(),
    userName: os.userInfo().username,
    os: `${os.type()} ${os.platform()} ${os.arch()} ${os.release()}`,
    ip: ip.join(' '),
    cpuCount: os.cpus().length,
    mem: `${os.totalmem() >>> 20}MB`,
  }));
});
