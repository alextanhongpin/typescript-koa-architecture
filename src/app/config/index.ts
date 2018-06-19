import convict from 'convict'

let config = convict({
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 8080,
    env: "PORT",
    arg: "port"
  },
  service: {
    doc: 'The name of the microservice.',
    format: String,
    default: 'test-svc',
    env: 'SERVICE'
  },
  mysql: {
    host: {
      doc: 'The database host.',
      format: String,
      default: 'localhost',
      env: 'DB_HOST'
    },
    user: {
      doc: 'The database user.',
      format: String,
      default: 'user',
      env: 'DB_USER'
    },
    password: {
      doc: 'The database password.',
      format: String,
      default: 'pass',
      env: 'DB_PASS'
    },
    database: {
      doc: 'The database name.',
      format: String,
      default: 'db',
      env: 'DB_NAME'
    },
    port: {
      doc: 'The database port.',
      format: 'port',
      default: 3306,
      env: 'DB_PORT'
    }
  }
})

export function makeConfig() {
  config.validate({ allowed: 'strict' })
  return config
}