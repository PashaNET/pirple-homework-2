/**
 *  CLI Tasks
 */

 //Dependencies
 let validators = require('../servises/validators'),
     readline = require('readline'),
     util = require('util'),
    //  debug = require('debug'),
     events = require('events'),
     cliCommands = {
        'menu': 'View all menu items',
        'orders --{time}': 'View orders placed in {time} hours', 
        'order --{id}': 'Lookup the details of a specific order by it ID', 
        'users --{time}': 'View users who have signed up in the last {time} hours', 
        'user --{email}': 'Lookup the details of a specific user by email address', 
        'exit': 'Terminate CLI and server'
    };

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
        let commands = Object.keys(cliCommands);
        let command = input.trim().toLowerCase(),
            commandIndex = commands.indexOf(command);
        //perform action if command exist in commands list
        if(commandIndex > -1) {
            ev.emit(input, commandIndex);
        } else {
            console.log(input + ' - is not recognizable command!');
            console.log('Please, try again!');
        }
    }
 };

 ev.on('menu', (str) => {
    //
 });

 ev.on('orders', (str) => {
    //
 });

 ev.on('order', (str) => {
    //
 });

 ev.on('users', (str) => {
    //
 });

 ev.on('user', (str) => {
    //
 });

 ev.on('help', (str) => {
    //
    cli.horizontalLine();
    cli.centeredHeader('CLI HELP');
    cli.horizontalLine();
    
    //
    for(let commandName in cliCommands){
        if(cliCommands.hasOwnProperty(commandName)){
            let value = cliCommands[commandName],
                coloredCommandName = '\x1b[32m' + commandName + '\x1b[0m',
                distanseBetweenNameAndDescription = 40,
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