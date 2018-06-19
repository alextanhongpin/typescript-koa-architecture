import mysql, { Pool, PoolOptions } from 'mysql2/promise'

export type Database = Pool;

export type DatabaseOptions = PoolOptions

export async function makeConnection(options: DatabaseOptions): Promise<Database> {
  // Create the connection pool. The pool-specific settings are the defaults
  let defaultOptions = {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
  }
  return mysql.createPool({ ...defaultOptions, ...options })
}
