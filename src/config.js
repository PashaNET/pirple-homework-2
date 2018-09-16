let environment = {};

environment.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging'
};
environment.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
};

let envMode = typeof(NODE_ENV) == 'string' ? NODE_ENV : 'staging'
module.exports = typeof(environment[envMode]) == 'object' ? environment[envMode] : environment.staging;