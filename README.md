# pirple.com
Homework Assignment #2
API description with examples of data requires to be present in requests
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
#/menuItems
    get - read 
        * token in header required
        {
            "email": "test@n.com"
        }
#/shoppingCart
    post - create 
        {
            "items": [{itemId: 1, quantity: 2}}
        }
#/order


