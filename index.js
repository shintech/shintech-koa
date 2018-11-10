const Koa = require('koa')
const koaCompress = require('koa-compress')
const bodyParser = require('koa-bodyparser')

module.exports = ({
  logger = console,
  environment = 'development',
  port = 8000,
  host = 'localhost',
  db = {},
  compress = false
}) => {
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

  if (compress) {
    server.use(koaCompress({
      threshold: 1024
    }))
  }

  server.use(async (ctx, next) => {
    ctx.logger = logger
    ctx.db = db

    await next()
  })

  return server
}
