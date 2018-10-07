let environment = {};

let stripeService = {
    hostname: 'api.stripe.com',
    paymentPath: '/v1/charges',
    secretKey: 'sk_test_...'
}

environment.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashSecret: 'testSecret',
    stripe: stripeService
};
environment.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashSecret: 'prodSecretKey',
    stripe: stripeService
};

let envMode = typeof(NODE_ENV) == 'string' ? NODE_ENV : 'staging'
module.exports = typeof(environment[envMode]) == 'object' ? environment[envMode] : environment.staging;