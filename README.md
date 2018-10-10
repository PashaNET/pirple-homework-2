# pirple.com
Homework Assignment #2
  
Project structure:
```bash
├── .data
├── https
├── src
│   ├── controllers
│   ├── emailTemplates
│   ├── models
│   ├── services
│   ├── config.js
│   ├── routers.js
│   └── server.js
├── index.js
├── README.md
└── .gitignore
```

  server.js file responsible for choosing proper controller according to request. Every conroller works with certain model which reaponsible for operations with db and other logic related to this model.  
  
Short API description with examples of parameters and data to be present in requests

#/user 

    post - create 
        {
            "firstName":"..",
            "lastName":"..",
            "email": "test@n.com",
            "address": "...",
            "phone":"..",
            "agreement":true,
            "password":".."
        }
        
    get  - read 
        * token in header required
        {
            "email": "test@n.com"
        }
    put - update
        * token in header required
        {
            "email": "test@n.com"
            //any user field
        }
    delete - delete 
        * token in header required
        {
            "email": "test@n.com"
        }
#/token

    post - create 
        {
            "email": "test@n.com",
            "password":".."
        }
        
    get  - read 
        * token in header required
        {
            id: ".."
        }
    put - update
        * token in header required
        {
        	"id": "..",
	        "extend": true
        }
    delete - delete 
        * token in header required
        {
            "id": ".."
        }
#/menu

	get - read 
        * token in header required
        {
            "email": "test@n.com"
        }
#/cart

        post - create 
    	* token in header required
        {
	    "email": "test@n.com"
            "items": [{itemId: 1, quantity: 2}}
        } 
	
	get - read
	* token in header required
	{
	    "id": "...." 
	}
#/order
	
	post - create 
	{
	     "shoppingCartId" : "343m7fj3xnm3inq",
	     "status" : "created",
	     "description" : "some text",
	     "amount" : "300",
	     "source" : "test@n.com",
	     "currency" : "USD" 
	}

