import { UserModel, UserModelImpl } from './model'
import { UserService, UserServiceImpl } from './service'
import { UserRepository, MySQLUserRepositoryImpl } from './repository'
import { Database } from '../database'
import { Schema } from '../schema/index';

class ServiceFactory {
  constructor(private db: Database) { }

  makeRepository(): UserRepository {
    return new MySQLUserRepositoryImpl(this.db)
  }

  makeModel(repo: UserRepository, schema: Schema): UserModel {
    return new UserModelImpl(repo, schema)
  }

  makeService(model: UserModel): UserService {
    return new UserServiceImpl(model)
  }

  make(schema: Schema): UserService {
    let repo = this.makeRepository()
    let model = this.makeModel(repo, schema)
    let service = this.makeService(model)
    return service
  }
}

export default function makeUserService(db: Database, schema: Schema): UserService {
  return new ServiceFactory(db).make(schema)
}
