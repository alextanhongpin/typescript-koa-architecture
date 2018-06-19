import { UserModel, UserModelImpl } from './model'
import { UserService, UserServiceImpl, makeTracer, makeLogger } from './service'
import { decorate } from '../../util/decorator'
import { UserRepository, MySQLUserRepositoryImpl } from './repository'
import { Database } from '../../app/database'
import { Schema } from '../../util/schema';
import { Logger } from '../../app/logger';

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

  make(schema: Schema, log: Logger): UserService {
    let repo = this.makeRepository()
    let model = this.makeModel(repo, schema)
    let service = this.makeService(model)
    return decorate<UserService>(service, [makeLogger(log), makeTracer])
  }
}

export default function makeUserService(db: Database, schema: Schema, log: Logger): UserService {
  return new ServiceFactory(db).make(schema, log)
}
