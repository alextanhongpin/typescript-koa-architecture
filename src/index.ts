import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { connect, Database } from './database'
import { makeUserController, attachControllers } from './controller'
import { makeSchema } from './schema'
import { makeTracer } from './tracer'

import makeUserService from './user-service'
import userSchema from '../static/user.json'

(async function main() {
  let app = new Koa()
  app.use(bodyParser())

  let tracer = makeTracer('test-svc')
  let schema = makeSchema()
  schema.register('user', userSchema)

  const db = await connect('localhost', 'user', 'pass', 'db', 10)
  await makeTables(db)

  let userService = makeUserService(db, schema)
  let userController = makeUserController('/users', userService, tracer)

  attachControllers(app, [userController])
  app.listen(3000)

  console.log('listening to port *:3000. press ctrl + c to cancel')
})().catch(console.error)

async function makeTables(db: Database) {
  let [rows, _fields] = await db.query('CREATE TABLE IF NOT EXISTS users (name TEXT, age TINYINT(1))')
  console.log('makeTables success', rows)
}
