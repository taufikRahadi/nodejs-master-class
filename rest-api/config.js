/**
 * create and export configuration variables
 */

const env = {}

// development environment
env.development = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'development',
  hashSecret: 'WebProgrammingUT'
}

// production environment
env.production = {
  httpPort: 8081,
  httpsPort: 8080,
  envName: 'production',
  hashSecret: 'WebProgrammingUT'
}

// determine which environment was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// check that the current environment is one of the environments above, if not, use the default env instead
const envToExport = typeof(env[currentEnv]) == 'object' ? env[currentEnv] : env.dev

// export the module
module.exports = envToExport
