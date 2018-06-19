import { UserRepository } from './repository'
import { User } from './entity'
import { Schema } from '../../util/schema'

export interface UserModel {
  create(user: User): Promise<boolean>
  read(): Promise<User[]>
}

export class UserModelImpl implements UserModel {
  constructor(private repo: UserRepository, private schema: Schema) { }

  async create(user: User): Promise<boolean> {
    let validUser = await this.schema.validateAsync('user', user)
    return this.repo.create(validUser)
  }

  async read(): Promise<User[]> {
    return this.repo.read()
  }
}
