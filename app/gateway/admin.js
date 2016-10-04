import koaSend from 'koa-send';
import path from 'path';
import http from 'http';
import { c2p } from '../util';

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

export default router => {

  router.get('/static/*', async ctx => {
    await send(ctx, ctx.params[0]);
  });

  router.get('/*', async ctx => {
    await koaSend(ctx, 'admin.html', { root: __dirname });
  });
  
}
