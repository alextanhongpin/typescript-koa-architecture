import { UserModel } from './model'
import { User } from './entity'

export interface UserService {
  create(name: string): Promise<boolean>
  read(): Promise<User[]>
}

export class UserServiceImpl implements UserService {
  constructor(private model: UserModel) { }

  async create(name: string): Promise<boolean> {
    return this.model.create(name)
  }

  async read(): Promise<User[]> {
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

// export class UserServiceDecorator implements UserService {
//   constructor(private service: UserService, private tracer: opentracing.Tracer) {}
//   async create(name: string): Promise<boolean> {
//     // let span = tracer.startSpan('create')
//     // span.log({ event: 'something', method: ''})
//     let result = await this.service.create(name)
//     // span.finish()
//     return result
//   }
//   async read(): Promise<User[]> {

//   }
// }