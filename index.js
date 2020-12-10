
/* index.js */

import Koa from 'koa'
const cors = require('@koa/cors');
import https from 'https'

const app = new Koa();
app.use(cors());

const defaultPort = 8080
const port = process.env.PORT || defaultPort

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
