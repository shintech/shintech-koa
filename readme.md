## shintech/shintech-koa

### Installation
    # Ubuntu 18.04
    
    yarn install shintech-koa
    
### Usage
  
    #index.js
        
    const root = __dirname
    const environment = process.env['NODE_ENV']
    const port = process.env['PORT'] || 8000
    const host = process.env['HOST'] || '127.0.0.1'
    
    const pkg = require('./package.json')
    
    const logger = require('shintech-logger')({ 
      environment
    })
    
    const router = require('./router')
    
    const server = require('./server')({ 
      pkg,
      logger,
      router,
      environment,
      port,
      root
    })
    
    const app = server.listen(port, () => {
      logger.info(`${pkg.name} - version: ${pkg.version} - listening at ${host}:${port}...`)
      logger.info(`served from ${root}...`)
    })
    
    app.on('close', () => {
      logger.warn('shutting down server...')
      logger.info('goodbye...')
    })
    
    process.on('SIGINT', () => {
      app.close()
    })

