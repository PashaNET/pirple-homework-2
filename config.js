let environment = {};

environment.staging = {
    port: 3001,
    envName: 'staging'
};
environment.production = {
    port: 3000,
    envName: 'production'
};

let envMode = typeof(NODE_ENV) == 'string' ? NODE_ENV : 'staging'
module.exports = typeof(environment[envMode]) == 'object' ? environment[envMode] : environment.staging;