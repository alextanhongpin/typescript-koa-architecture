import Koa from 'koa'
import Router from 'koa-router'
import { UserService } from '../user-service/service'

export interface Controller {
  attach(app: Koa): void
}

export function attachControllers(app: Koa, controllers: Controller[]): Koa {
  for (let c of controllers) {
    c.attach(app)
  }
  return app
}

export class UserController {
  private router: Router;
  constructor(readonly prefix: string, private users: UserService) {
    this.router = new Router({ prefix })
  }

  attach(app: Koa) {
    this.router
      .get('/', this.getUsers.bind(this))
      .post('/', this.postUser.bind(this))

    app.use(this.router.routes())
  }

  async getUsers(ctx: Koa.Context) {
    try {
      const users = await this.users.read()
      ctx.body = users
    } catch (error) {
      ctx.body = error
    }
  }

  async postUser(ctx: Koa.Context) {
    try {
      const users = await this.users.create('hello')
      ctx.body = users
    } catch (error) {
      ctx.body = error
    }
  }
}

export function makeUserController(prefix: string, users: UserService) {
  return new UserController(prefix, users)
}