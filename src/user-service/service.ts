import * as opentracing from 'opentracing'

import { UserModel } from './model'
import { User } from './entity'
import { Context, spanFromContext } from '../context'

export interface UserService {
  create(ctx: Context, user: User): Promise<boolean>
  read(ctx: Context): Promise<User[]>
}

export class UserServiceImpl implements UserService {
  constructor(private model: UserModel) { }

  async create(ctx: Context, user: User): Promise<boolean> {
    return this.model.create(user)
  }

  async read(ctx: Context): Promise<User[]> {
    return this.model.read()
  }

  // Example of service orchestration
  // async createIfNotExist(name: string) {
  //   let {model} = this
  //   let exist = await model.find(name)
  //   if (exist) {
  //     return false
  //   }
  //   return model.create(name)
  // }
}

class TraceServiceDecorator implements UserService {
  constructor(private service: UserService) { }

  async create(ctx: Context, user: User): Promise<boolean> {
    ctx = spanFromContext(ctx, 'create-user')

    let result = await this.service.create(ctx, user)
    ctx.span.finish()

    return result
  }

  async read(ctx: Context): Promise<User[]> {
    ctx = spanFromContext(ctx, 'read-user')

    let result = await this.service.read(ctx)
    ctx.span.finish()

    return result
  }
}

export function makeTrace(service: UserService): UserService {
  return new TraceServiceDecorator(service)
}
