export default router => {

  router.get('/-/:bucket/bucket-name', async ctx => {
    ctx.body = ctx.params.bucket;
  });

};
