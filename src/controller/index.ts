import Koa from 'koa'
import Router from 'koa-router'
import { UserService } from '../user-service/service'
import { Context, spanFromContext, contextFromHttpHeaders } from '../context'
import * as opentracing from 'opentracing'

export interface Controller {
  attach(app: Koa): void
}

export function attachControllers(app: Koa, controllers: Controller[]) {
  for (let c of controllers) {
    c.attach(app)
  }
}

export class UserController {
  private router: Router;
  constructor(readonly prefix: string, private users: UserService, private tracer: opentracing.Tracer) {
    this.router = new Router({ prefix })
  }

  attach(app: Koa) {
    this.router
      .use(this.traceMiddleware.bind(this))
      .get('/', this.getUsers.bind(this))
      .post('/', this.postUser.bind(this))

    app.use(this.router.routes())
  }

  async traceMiddleware(ctx: Koa.Context, next: Function) {
    let method = 'GET'
    let status: number = 200
    let url = ctx.url

    let rootCtx = contextFromHttpHeaders('http_server', this.tracer, ctx.req.headers)
    ctx.state.rootCtx = rootCtx

    try {
      ctx.status = status
      await next()
    } catch (error) {

      rootCtx.span.log({
        'error.kind': 'BadRequest',
        'message': error.message,
        'stack': error.stack
      })
      rootCtx.span.setTag('error', true)

      status = error.status || 400
      ctx.status = status

      ctx.body = {
        error: 'BadRequest',
        code: 400,
        message: error.message
      }
    } finally {
      rootCtx.span.setTag('component', 'http')
      rootCtx.span.setTag('http.method', method)
      rootCtx.span.setTag('http.status_code', status)
      rootCtx.span.setTag('http.url', url)
      rootCtx.span.finish()
    }
  }

  async getUsers(ctx: Koa.Context) {
    const users = await this.users.read(ctx.state.rootCtx)
    ctx.body = { data: users }
  }

  async postUser(ctx: Koa.Context) {
    const response = await this.users.create(ctx.state.rootCtx, ctx.request.body)
    ctx.body = { data: response }
  }
}

export function makeUserController(prefix: string, users: UserService, tracer: opentracing.Tracer) {
  return new UserController(prefix, users, tracer)
}