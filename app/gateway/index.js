import Koa from 'koa';
import { c2p, catched } from '../util';
import { connect, hget } from '../util/redis';
import query from './query';
import admin from './admin';
import KoaRouter from 'koa-router';

export default catched(async function (argv) {
  connect(argv[0]);

  const port = (await hget('settings', 'gateway:port')) || 80;
  const domain = (await hget('settings', 'gateway:domain')) || '';
  const app = new Koa();

  if (domain) {
    app.use(catched(async (ctx, next) => {
      const host = ctx.host.replace(/\:[0-9]+$/, '');
      const bucketLen = host.length - domain.length - 1;
      if (bucketLen > 0 && host.substr(bucketLen) === `.${domain}`) {
        const bucket = host.substr(0, bucketLen);
        ctx.url = `/-/${bucket}${ctx.url}`;
      }
      await next();
    }));
  }

  const router = KoaRouter();

  query(router);
  admin(router);

  app.use(router.routes())
    .use(router.allowedMethods());

  await c2p(cb => app.listen(port, cb));
  console.log(`Listening on ${port}`);
});
