/**
 * Frontend scripts //TODO check and divide in separate files 
 */

 // app container
let app = {};

app.config = {
    sessionToken: false
};

app.client = {
    request: (params) => {
        // Validate and set default values to parameters
        headers = typeof(params.headers) == 'object' && params.headers !== null ? params.headers : {};
        path = typeof(params.path) == 'string' ? params.path : '/';
        method = typeof(params.method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(params.method.toUpperCase()) > -1 ? params.method.toUpperCase() : 'GET';
        queryStringObject = typeof(params.queryStringObject) == 'object' && params.queryStringObject !== null ? params.queryStringObject : {};
        payload = typeof(params.payload) == 'object' && params.payload !== null ? params.payload : {};
        callback = typeof(params.callback) == 'function' ? params.callback : false;
      
        // For each query string parameter sent, add it to the path
        let requestUrl = path + '?',
            index = 0,
            lastIndex = Object.keys(queryStringObject).length - 1;

        for(let queryKey in queryStringObject) {
            if(queryStringObject.hasOwnProperty(queryKey)) {
                index++;
                requestUrl +=queryKey + '=' + queryStringObject[queryKey];

                if(index !== lastIndex) {
                    requestUrl += '&';
                }
            }
        }
      
        // Form the http request as a JSON type
        let xhr = new XMLHttpRequest();
        xhr.open(method, requestUrl, true);
        xhr.setRequestHeader('Content-type', 'application/json');
      
        // For each header sent, add it to the request
        for(let headerKey in headers) {
           if(headers.hasOwnProperty(headerKey)) {
             xhr.setRequestHeader(headerKey, headers[headerKey]);
           }
        }
      
        // Add sessiontoken as a header
        if(app.config.sessionToken) {
          xhr.setRequestHeader('token', app.config.sessionToken.tokenId);
        }
      
        //Handle the response
        xhr.onreadystatechange = () => {
            if(xhr.readyState == XMLHttpRequest.DONE) {
              let statusCode = xhr.status;
              let responseReturned = xhr.responseText;
      
              // Callback if requested
              if(callback) {
                try {
                  let parsedResponse = JSON.parse(responseReturned);
                  callback(statusCode, parsedResponse);
                } catch(e) {
                  callback(statusCode, false);
                }
              }
            }
        }
      
        // Send the payload as JSON
        let payloadString = JSON.stringify(payload);
        xhr.send(payloadString);
      }
};

// Bind the forms
app.bindForms = () => {
    let form = document.querySelector('form');
    if(!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let formId = this.id;
      let path = this.action;
      let method = this.method.toUpperCase();
      let formErrorField = document.querySelector('#' + formId + ' .formError');
  
      // Hide the error message (if it's currently shown due to a previous error)
      formErrorField.style.display = 'hidden';
  
      // Turn the inputs into a payload
      let payload = {};
      let elements = this.elements;
      for(let i = 0; i < elements.length; i++){
        if(elements[i].type !== 'submit'){
          let valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
          payload[elements[i].name] = valueOfElement;
        }
      }
      
      let params = {path, method, payload};
      params.callback = (statusCode, responsePayload) => {
        // Display an error on the form if needed
        if(statusCode !== 200){
  
          // Try to get the error from the api, or set a default error message
          let error = typeof(responsePayload.message) == 'string' ? responsePayload.message : 'An error has occured, please try again';
  
          // Set the formError field with the error text//TODO one selector
          formErrorField.innerHTML = error;
  
          // Show (unhide) the form error field on the form
          formErrorField.style.display = 'block';
        } else {
          // If successful, send to form response processor
          app.formResponseProcessor(formId, payload, responsePayload);
        }
      }

      app.client.request(params);
    });
  };
  
  // Form response processor
  app.formResponseProcessor = function(formId, requestPayload, responsePayload){
    // If account creation was successful, try to immediately log the user in
    if(formId == 'accountCreate'){
      // Take the email and password, and use it to log the user in
      let params = {
        path: 'api/token',
        method: 'POST',
        payload: {
          email : requestPayload.email,
          password : requestPayload.password
        }
      }
      params.callback = (newStatusCode, newResponsePayload) => {
        // Display an error on the form if needed
        if(newStatusCode !== 200){
          let formErrorField = document.querySelector('#' + formId + ' .formError');
          
          // Set the formError field with the error text
          formErrorField.innerHTML = newResponsePayload.message;
  
          // Show (unhide) the form error field on the form
          formErrorField.style.display = 'block';
  
        } else {
          // If successful, set the token and redirect the user
          app.setSessionToken(newResponsePayload);
          window.location = '/menu';
        }
      };
      app.client.request(params);
    }
    // If login was successful, set the token in localstorage and redirect the user
    if(formId == 'sessionCreate'){
      app.setSessionToken(responsePayload);
      window.location = '/menu';
    }
  };
  
  // Get the session token from localstorage and set it in the app.config object
app.getSessionToken = () => {
  let tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try {
      let token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      app.setLoggedInClass(typeof(token) == 'object');
    } catch(e) {
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  let target = document.querySelector('body'),
      loggedInClass = add ? 'loggedIn' : 'loggedOut';

  if(add){
    target.classList.remove('loggedOut');
  } else {
    target.classList.remove('loggedIn');
  }
  
  target.classList.add(loggedInClass);
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  let tokenString = JSON.stringify(token);
  localStorage.setItem('token', tokenString);

  app.setLoggedInClass(typeof(token) == 'object');
};

// Renew the token
app.updateToken = (method, additionalParams, callback) => {
  let currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    //prepare params for token update
    let params = {
      path: 'api/token',
      method: method,
      payload: {
        id: currentToken.tokenId,
        email: currentToken.email,
        ...additionalParams
      }
    }
    params.callback = (statusCode, responsePayload) => {
      if(statusCode == 200){
        app.setSessionToken(responsePayload);
        callback(false);
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    }

    // Update the token with a new expiration
    app.client.request(params);
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Loop to renew token often
app.tokenRenewalLoop = () => {
  setInterval(() => {
    app.updateToken('PUT', {extend : true}, (err) => {
      if(!err){
        console.log('Token renewed successfully');
      }
    });
  }, 1000 * 60);
};

app.bindLogout = () => {
  document.getElementById('logout-menu-item').addEventListener('click', (e) => {
    e.preventDefault();
    
    app.updateToken('DELETE', {}, (err) => {
      if(!err){
        console.log('Token was deleted successfully');
      }
    });
  });
}

app.bindAddCartButton = () => {
  let buttons = document.getElementsByClassName('add-cart-button');
  if(buttons.length == 0) return 

  for(let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
      e.preventDefault();

      let itemId = buttons[i].dataset.id,
          itemName = buttons[i].dataset.name,
          cartId = localStorage.getItem('cartId'),
          method = cartId ? 'PUT' : 'POST',
          payload = {
            email: app.config.sessionToken.email,
            id: cartId,
            items: [{itemId: itemId, itemName: itemName, quantity: 1}]
          }

      let params = {path: '/api/cart', method, payload};
      params.callback = (statusCode, responsePayload) => {
        // Show allert with error 
        if(statusCode !== 200){
          alert('Error: ' + responsePayload.message);
        } else {
          if(responsePayload.cart && responsePayload.cart.id){
            localStorage.setItem('cartId', responsePayload.cart.id);
          }

          alert('Item has been added to cart!');
        }
      }

      app.client.request(params);
    });
  }
}

app.bindCart = () => {
  let cartIcon = document.getElementById('cart-item');
  
  cartIcon.addEventListener('click', function(e) {
    e.preventDefault();

    window.location = '/cart?id=' + localStorage.getItem('cartId');
  });
}

app.bindCreateOrder = () => {
  let orderButton = document.getElementById('create-order');
  if(!orderButton) return;

  orderButton.addEventListener('click', function(e) {
    e.preventDefault();

    let clientEmail = app.config.sessionToken.email;
    if(!clientEmail) alert('Please loging before placing order');

    let payload = {
          source: clientEmail,
          shoppingCartId: localStorage.getItem('cartId'),
          currency: 'USD',
          description: ''
        }

    let params = {
      path: '/api/order', 
      method: 'POST', 
      payload
    };
    params.callback = (statusCode, responsePayload) => {
      // Show allert with error 
      if(statusCode !== 200){
        alert('Error: ' + responsePayload.message);
      } else {
        if(responsePayload){
          localStorage.removeItem('cartId');
        }

        alert('Thank you for your order!');
        window.location = '/menu';
      }
    }

    app.client.request(params);
  });
}

// Init (bootstrapping)
app.init = () => {
  // Bind all form submissions
  app.bindForms();
  // Get the token from localstorage
  app.getSessionToken();
  // Renew token
  app.tokenRenewalLoop();
  
  //Buttons
  //'Logout' 
  app.bindLogout();
  //'Add to the cart'  
  app.bindAddCartButton()
  //'Cart'
  app.bindCart()
  //'Create order' 
  app.bindCreateOrder()
};

// Call the init processes after the window loads
window.onload = () => {
  app.init();
};