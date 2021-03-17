/**
 * create and export configuration variables
 */

const env = {}

// development environment
env.development = {
  port: 3000,
  envName: 'development'
}

// production environment
env.production = {
  port: 8080,
  envName: 'production'
}

// determine which environment was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// check that the current environment is one of the environments above, if not, use the default env instead
const envToExport = typeof(env[currentEnv]) == 'object' ? env[currentEnv] : env.dev

// export the module
module.exports = envToExport
