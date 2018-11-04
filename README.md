# pirple.com
Homework Assignment #3
  
Project structure:
```bash
├── .data
├── https
├── public
│   ├── images
│   ├── main.css
│   └── main.js
├── src
│   ├── controllers
│   ├── emailTemplates
│   ├── models
│   ├── pages
│   │   ├── cart
│   │   │   ├── cart.html
│   │   │   └── item.html
│   │   ├── layout
│   │   │   ├── header.html
│   │   │   └── footer.html
│   │   ├── menu
│   │   │   ├── menu.html
│   │   │   └── item.html
│   │   ├── account.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── order.html
│   │   └── userInterfaceHandler.js
│   ├── services
│   ├── config.js
│   ├── routers.js
│   └── server.js
├── index.js
├── README.md
├── favicon.ico
└── .gitignore
```

Simple UI for API


1. Signup
    - go to 'home' page or '/session/create' page and fill all required fields
2. View all the items available to order
    - after you registered you will be redirect to pages with items
3. Fill up a shopping cart
    - one click on 'Add to cart button' adds it to cart. 
    - to see all list, click on cart icon in the site menu
4. Place an order (with fake credit card credentials), and receive an email receipt
    - click 'Create order' to save to place order
