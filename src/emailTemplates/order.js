
/**
 * Simple template for email
 * @param {*} params 
 */
function getOrderTemplate(params = {}){
    return `Hello ${params.source} \n
            Your order id ${params.id} \n
            It will be delivered in 30 min`;
}

module.exports = getOrderTemplate;