import Koa from 'koa'

import { connect, Database } from './database'
import { makeUserController, attachControllers } from './controller'
import { SchemaFactory } from './schema'
import { makeTracer } from './tracer'
import makeUserService from './user-service'
import userSchema from '../static/user.json'

(async function main() {
  let app = new Koa()

  let tracer = makeTracer('test-svc')

  let span = tracer.startSpan('hello')
  // span.setTag(opentracing.Tags.ERROR, true)
  span.log({ event: 'world' })
  span.finish()

  let schema = SchemaFactory()
  schema.register('user', userSchema)

  const db: Database = await connect('localhost', 'user', 'pass', 'db', 10)

  let users = makeUserService(db, schema)

  let userController = makeUserController('/users', users)

  app = attachControllers(app, [userController])
  app.listen(3000)

  console.log('listening to port *:3000. press ctrl + c to cancel')
})().catch(console.error)
