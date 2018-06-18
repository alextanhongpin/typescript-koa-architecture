import mysql, { Pool } from 'mysql2/promise'

export type Database = Pool;

export async function connect(host: string, user: string, password: string, database: string, connectionLimit: number, port = 3306): Promise<Database> {
  // Create the connection pool. The pool-specific settings are the defaults
  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
  })
}

