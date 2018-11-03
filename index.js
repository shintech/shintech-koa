const Koa = require('koa')
const compress = require('koa-compress')
const bodyParser = require('koa-bodyparser')

module.exports = ({ logger, db, router, environment, port, pkg }) => {
  const server = new Koa()

  server.use(async (ctx, next) => {
    await next()

    const rt = ctx.response.get('X-Response-Time')
    const message = `${ctx.method} ${ctx.status} ${ctx.url} - ${rt}`

    switch (ctx.status) {
      case 200:
        logger.info(message)
        break

      case 500:
        logger.error(message)
        break

      default:
        logger.warn(message)
    }
  })

  server.use(async (ctx, next) => {
    const start = Date.now()

    await next()

    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  server.use(bodyParser())
  server.use(compress({
    threshold: 1024
  }))

  server.use(async (ctx, next) => {
    ctx.logger = logger
    ctx.db = db

    await next()
  })

  server.use(router.routes())
  server.use(router.allowedMethods())

  server.use((ctx, next) => {
    ctx.body = {
      status: 'error'
    }

    ctx.status = 404
  })

  return server
}
