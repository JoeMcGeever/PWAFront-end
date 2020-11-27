
/* index.js */

import Koa from 'koa'
import https from 'https'

const app = new Koa()

const port = 8080

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
