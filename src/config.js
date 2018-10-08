let environment = {};

let stripeService = {
    staging: {
        hostname: 'api.stripe.com',
        paymentPath: '/v1/charges',
        secretKey: 'sk_test_...'
    },
    prod: {
        hostname: 'api.stripe.com',
        paymentPath: '/v1/charges',
        secretKey: 'sk_test_...'
    }
}
let mailgunService = {
    staging: {
        host: 'api.mailgun.net',
        path: '/v3/sandboxXXXXXXXXXXXXXXXXXX.mailgun.org/messages',
        authUsername: '',
        authKey: ''
    },
    prod: {

    }
}

environment.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashSecret: 'testSecret',
    stripe: stripeService.staging,
    mailgun: mailgun.staging
};
environment.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashSecret: 'prodSecretKey',
    stripe: stripeService.prod,
    mailgun: mailgun.prod
};

let envMode = typeof(NODE_ENV) == 'string' ? NODE_ENV : 'staging'
module.exports = typeof(environment[envMode]) == 'object' ? environment[envMode] : environment.staging;