import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { makeConnection, Database } from './app/database'
import { makeConfig } from './app/config'
import { makeLogger, Logger } from './app/logger'

import { makeUserController, attachControllers } from './controller'
import { makeSchema } from './util/schema'
import { makeTracer } from './util/tracer'


import makeUserService from './service/user'
import userSchema from '../static/user.json'

(async function main() {
  let app = new Koa()
  app.use(bodyParser())

  let config = makeConfig()
  let log = makeLogger(config.get('service'))
  let tracer = makeTracer(config.get('service'))
  let schema = makeSchema()

  schema.register('user', userSchema)

  const db = await makeConnection(config.get('mysql'))
  await makeTables(db, log)

  let userService = makeUserService(db, schema, log)
  let userController = makeUserController('/users', userService, tracer)

  attachControllers(app, [userController])
  app.listen(config.get('port'))

  console.log(`listening to port *:${config.get('port')}. press ctrl + c to cancel`)
})().catch(console.error)

async function makeTables(db: Database, log: Logger) {
  let [_rows, _fields] = await db.query('CREATE TABLE IF NOT EXISTS users (name TEXT, age TINYINT(1))')
  log.info({
    'db.type': 'mysql',
    'db.table': 'users'
  }, 'create table success')
}
