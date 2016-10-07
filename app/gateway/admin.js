import koaSend from 'koa-send';
import coBody from 'co-body';
import path from 'path';
import http from 'http';
import fs from 'fs';
import { c2p, hash } from '../util';
import { hget, hset, set, get, exists } from '../util/redis';
import svgCaptcha from 'svg-captcha';

async function send(ctx, fpath) {
  if (DEBUG) {
    await c2p(cb => {
      http.get(`http://127.0.0.1:8081/static/${fpath}`, res => {
        ctx.status = res.statusCode;
        ctx.body = res;
        cb();
      }).on('error', e => {
        ctx.status = 404;
        ctx.body = { error: 'Not Found' };
        cb();
      });
    });
  } else {
    return koaSend(ctx, fpath, {
      root: path.join(__dirname, 'fe-dist'),
    });
  }
}

function api(fn) {
  return async (ctx, ...args) => {
    try {
      ctx.body = await fn(ctx, ...args);
      ctx.status = 200;
      if (typeof ctx.body === 'undefined') {
        ctx.body = { ok: true };
      }
    } catch (err) {
      if (typeof err === 'string') {
        ctx.status = 406;
        ctx.body = err;
      } else {
        ctx.status = 500;
        ctx.body = err.stack || err.message || err;
        console.error(ctx.body);
      }
    }
  };
}

async function auth(ctx, next) {
  const token = ctx.cookies.get('token');
  if (token) {
    const key = `auth:${token}`;
    const isAuthed = !!(await exists(key));
    if (isAuthed) {
      set(key, 'AUTH', 'EX', 3600);
      await next();
    } else {
      ctx.status = 401;
      ctx.body = '没有登录';
    }
  }
}

export default router => {

  const html = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf-8');

  router.get('/captcha', async ctx => {
    const randomText = svgCaptcha.randomText({
      size: 6,
      ignoreChars: '1234567890',
    }).toUpperCase();
    ctx.cookies.set('captcha', hash(randomText));
    ctx.set('Content-type', 'image/svg+xml');
    ctx.body = svgCaptcha(randomText);
  });

  router.get('/static/*', async ctx => {
    await send(ctx, ctx.params[0]);
  });

  router.get('/*', async ctx => {
    const token = ctx.cookies.get('token');
    let isAuthed = false;
    if (!token) {
      ctx.cookies.set('token', hash(`${Date.now()}-${Math.random()}`));
    } else {
      const key = `auth:${token}`;
      isAuthed = !!(await exists(key));
      if (isAuthed) {
        set(key, 'AUTH', 'EX', 3600);
      }
    }
    ctx.set('Content-Type', 'text/html; charset=UTF-8');
    ctx.body = html.replace('{%IS_AUTHED%}', JSON.stringify(isAuthed));
  });
  
  router.post('/login', api(async ctx => {
    const token = ctx.cookies.get('token');
    if (!token) {
      throw '请求无效';
    }
    const body = await coBody.json(ctx);
    if (hash(body.captcha.toUpperCase()) !== ctx.cookies.get('captcha')) {
      throw '验证码错误';
    }
    const password = await hget('settings', 'admin:password');
    if (password && hash(body.password) !== password) {
      throw '密码错误';
    }
    set(`auth:${token}`, 'AUTH', 'EX', 60);
  }));

  router.post('/change-password', auth, api(async ctx => {
    const vals = await coBody.json(ctx);
    const old = await hget('settings', 'admin:password');
    if (old && hash(vals.old) !== old) {
      throw '原始密码错误';
    }
    await hset('settings', 'admin:password', hash(vals.new));
  }));
}
