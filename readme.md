## shintech/shintech-koa

### Installation
    # Ubuntu 18.04
    
    yarn install shintech-koa
    
### Usage
  
    #index.js
    
    const pkg = require('./package.json')
    const root = __dirname
    const environment = process.env['NODE_ENV']
    const port = process.env['PORT'] || 8000
    const host = process.env['HOST'] || '127.0.0.1'
    
    const logger = require('shintech-logger')({ environment })
    const router = require('./router')
    const server = require('shintech-koa')({ pkg, logger, router, environment, port, root })
    