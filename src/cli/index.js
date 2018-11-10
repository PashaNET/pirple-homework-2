/**
 *  CLI Tasks
 */

 //Dependencies
 let validators = require('../servises/validators'),
     readline = require('readline'),
     events = require('events'),
     MenuItem = require('../models/MenuItem'),
     Order = require('../models/Order'),
     User = require('../models/User');

 class Events extends events {}
 let ev = new Events();

 //Container for cli tasks
 let cli = {};

 cli.init = () => {
    let blueColor = '\x1b[34m%s\x1b[0m';
    console.log(blueColor, 'The CLI is running');

    //setup interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    _interface.prompt();

    //add listener to line input 
    _interface.on('line', (str) => {
        cli.processInput(str);
        _interface.prompt();
    });

    //add handler on console closing
    _interface.on('close', () => {
        process.exit(0);
    });
 };
 
 cli.processInput = (input) => {
    let isValidInput = validators.isValidString(input);
    if(isValidInput){
        let commands = ['menu', 'order', 'orders', 'user', 'users', 'help', 'exit'],
            lineParts = input.trim().toLowerCase().split('--'),
            command = lineParts[0].trim(),
            parameter = lineParts[1];

        let commandPresentInList = commands.some((value, index) => {
            return value.indexOf(command) > -1;
        });

        if(commandPresentInList){
            ev.emit(command, parameter);
        } else {
            console.log(input + ' - is not recognizable command!');
            console.log('Please, try again!');
        }
    }
 };

 ev.on('menu', (str) => {
    //show header block
    cli.horizontalLine();
    cli.centeredHeader('Products list');
    cli.horizontalLine();

    //get all menu items and list it to console
    MenuItem.getAll((err, message, items) => {
        if(!err){
            items.forEach((item)=>{
                console.log('');
                console.log('Title: ' + item.title);
                console.log('Price: ' + item.price);
                console.log('Description: ' + item.description);
            });
        }
    })
 });

 ev.on('orders', (parameter) => {
    //vefiry the period
    let period = validators.isValidString(parameter) ? parseInt(parameter) : 24;

    //list all orders placed in defained period of time
    Order.getAll(period, (err, item) => {
        if(!err) {
            console.log(' ');
            console.dir(item);
        }
    });
 });

 ev.on('order', (parameter) => {
    //vefiry the order id 
    let isValidId = validators.isValidString(parameter);
    if(isValidId){
        Order.getById(parameter, (err, message, order) => {
            if(!err){
                console.log(' ');
                console.dir(order);
            } else {
                console.log(message);
            }
        });
    }
 });

 ev.on('users', (str) => {
    //vefiry the period of registration
    let period = validators.isValidString(parameter) ? parseInt(parameter) : 24;

    //list all orders placed in defained period of time
    User.getAll(period, (err, item) => {
        if(!err) {
            console.log(' ');
            console.dir(item);
        }
    });
 });

 ev.on('user', (str) => {
    //vefiry the user email
    let isValidEmail = validators.isValidEmail(parameter);
    if(isValidEmail){
        User.getByEmail(parameter, (err, message, user) => {
            if(!err){
                console.log(' ');
                console.dir(user);
            } else {
                console.log(message);
            }
        });
    }
 });

 ev.on('help', (str) => {
    //show header
    cli.horizontalLine();
    cli.centeredHeader('CLI HELP');
    cli.horizontalLine();
    
    //list of all commands and it description
    let cliCommands = {
        'menu': 'View all menu items',
        'orders --{time}': 'View orders placed in {time} hours', 
        'order --{id}': 'Lookup the details of a specific order by it ID', 
        'users --{time}': 'View users who have signed up in the last {time} hours', 
        'user --{email}': 'Lookup the details of a specific user by email address', 
        'exit': 'Terminate CLI and server'
    }

    //
    for(let commandName in cliCommands){
        if(cliCommands.hasOwnProperty(commandName)){
            let value = cliCommands[commandName],
                coloredCommandName = '\x1b[32m' + commandName + '\x1b[0m',
                distanseBetweenNameAndDescription = 20,
                padding  = distanseBetweenNameAndDescription - coloredCommandName.length;
            
            let line = coloredCommandName;

            for(let i = 0; i < padding; i++){
                line += ' ';
            }

            line += value;
            console.log(line);
        }
    }

    cli.horizontalLine();
 });

 //shud down cli app and stop server
 ev.on('exit', (str) => {
    process.exit(0);
 });

 //show horizontal dashed line on full screen width
 cli.horizontalLine = () => {
    let screenWidth = process.stdout.columns;
    let line = '';
    
    for(let i = 0; i < screenWidth; i++){
        line += '-';
    }

    console.log(line);
 }

//show centered line 
 cli.centeredHeader = (str) => {
    let isValidString = validators.isValidString(str);
    if(isValidString){
        let screenWidth = process.stdout.columns,
            leftPadding = Math.floor((screenWidth - str.length)/2),
            line = '';
    
        for(let i = 0; i < leftPadding; i++){
            line += ' ';
        }

        console.log(line + str);
    } else {
        console.log(' ');
    }
 }

 module.exports = cli;