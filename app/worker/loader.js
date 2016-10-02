import phantom from 'phantom';
import { sleep, until } from '../util';

const phantomCreate = phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);

let curCookies = [];
let cookiesChangedTime = 0;
let cookiesSetTime = 0;
export function setCookies(cookies) {
  const list = [];
  Object.keys(cookies).forEach(domain => {
    const kv = cookies[domain];
    Object.keys(kv).forEach(key => {
      list.push({
        domain,
        name: key,
        value: kv[key],
        path: '/',
        secure: false,
        httponly: false,
      });
    });
  });
  curCookies = list;
  cookiesChangedTime = Date.now();
}

export async function loadPage(url) {
  const phInst = await phantomCreate;
  if (cookiesSetTime < cookiesChangedTime || Date.now() - cookiesSetTime > 600000) {
    cookiesSetTime = Date.now();
    const expires = new Date(Date.now() + 3600000).toUTCString();
    // await phInst.property('cookies', curCookies.map(v => ({ ...v, expires })));
  }
  const page = await phInst.createPage();
  const loadingRes = {};
  let loadingResCount = 0;
  let lastActiveTime = 0;
  let opened = false;
  page.on('onLoadFinished', () => {
    opened = true;
  });
  page.on('onResourceRequested', res => {
    lastActiveTime = Date.now();
    if (!loadingRes[res.id]) {
      loadingRes[res.id] = 1;
      loadingResCount++;
    }
  });
  page.on('onResourceReceived', res => {
    lastActiveTime = Date.now();
    if (loadingRes[res.id]) {
      delete loadingRes[res.id];
      loadingResCount--;
    }
  });
  page.on('onResourceError', res => {
    lastActiveTime = Date.now();
    if (loadingRes[res.id]) {
      delete loadingRes[res.id];
      loadingResCount--;
    }
  });
  lastActiveTime = Date.now();
  await page.open(url);
  await until(() =>
    opened && loadingResCount === 0 && Date.now() - lastActiveTime > 2000
  , 20000);
  await page.evaluate(function () {
    [].slice.call(document.getElementsByTagName('script'), 0)
      .reverse()
      .forEach(function (item) {
        try {
          item.parentElement.removeChild(item);
        } catch (e) {}
      });
  });
  const content = await page.property('content');
  await page.close();
  return content;
}

