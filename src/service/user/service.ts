import * as opentracing from 'opentracing'

import { UserModel } from './model'
import { User } from './entity'
import { Context, spanFromContext, contextWithRequestId } from '../../util/context'
import { Tags } from 'opentracing'
import { Logger } from '../../app/logger';
import { Decorator } from '../../util/decorator';

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

    try {
      ctx.span.log({ event: 'create' })
      let result = await this.service.create(ctx, user)
      return result
    } catch (error) {
      ctx.span.setTag(Tags.ERROR, true)
      ctx.span.log({
        'error.kind': 'BadRequest',
        'message': error.message,
        'stack': error.stack
      })
      throw error
    } finally {
      ctx.span.finish()
    }
  }

  async read(ctx: Context): Promise<User[]> {
    ctx = spanFromContext(ctx, 'read-user')

    try {
      ctx.span.log({ event: 'read' })
      let result = await this.service.read(ctx)
      return result
    } catch (error) {
      ctx.span.setTag(Tags.ERROR, true)
      ctx.span.log({
        'error.kind': 'BadRequest',
        'message': error.message,
        'stack': error.stack
      })
      throw error
    } finally {
      ctx.span.finish()
    }
  }
}

export function makeTracer(service: UserService): UserService {
  return new TraceServiceDecorator(service)
}



class LogServiceDecorator implements UserService {
  constructor(private service: UserService, private log: Logger) { }

  async create(ctx: Context, user: User): Promise<boolean> {
    ctx = contextWithRequestId(ctx)
    try {
      this.log.info({ requestId: ctx.requestId }, 'create user')
      let result = await this.service.create(ctx, user)
      return result
    } catch (error) {
      this.log.warn({
        requestId: ctx.requestId,
        'error.kind': 'ServiceError',
        'error.message': error.message,
        'error.stack': error.stack,
        'user.name': user.name,
        'age': user.age
      }, 'error creating user')
      throw error
    }
  }

  async read(ctx: Context): Promise<User[]> {
    ctx = contextWithRequestId(ctx)
    try {
      this.log.info({ requestId: ctx.requestId }, 'read user')
      let result = await this.service.read(ctx)
      return result
    } catch (error) {
      this.log.warn({
        requestId: ctx.requestId,
        'error.kind': 'ServiceError',
        'error.message': error.message,
        'error.stack': error.stack
      }, 'error reading user')
      throw error
    }
  }
}

export function makeLogger(log: Logger): Decorator<UserService> {
  return (service: UserService): UserService => new LogServiceDecorator(service, log)
}
