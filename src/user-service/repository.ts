import { Database } from '../database'
import { User } from './entity'
import { RowDataPacket, OkPacket } from 'mysql2'

export interface UserRepository {
  create(user: User): Promise<boolean>
  read(): Promise<User[]>
}

export class MySQLUserRepositoryImpl implements UserRepository {
  constructor(private db: Database) { }

  async create(user: User): Promise<boolean> {
    let [_rows, _fields] = await this.db.query('INSERT INTO users SET ?', user)
    return true
  }

  async read(): Promise<User[]> {
    let [rows, _fields] = await this.db.query('SELECT * FROM users')
    rows = (<RowDataPacket[]>rows)
    return rows.map(r => ({ name: r.name }))
  }
}
