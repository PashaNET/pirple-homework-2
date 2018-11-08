/**
 *  CLI Tasks
 */

 //Dependencies
 let validators = require('../servises/validators'),
     readline = require('readline'),
     util = require('util'),
    //  debug = require('debug'),
     events = require('events');

 class Events extends events {}

 let ev = new Events();
 
 ev.on('menu', (str) => {
    process.exit(0);
 });

 ev.on('orders', (str) => {
    process.exit(0);
 });

 ev.on('order', (str) => {
    process.exit(0);
 });

 ev.on('users', (str) => {
    process.exit(0);
 });

 ev.on('user', (str) => {
    process.exit(0);
 });

 ev.on('help', (str) => {
    let commandsDescription = {
        'menu': 'View all menu items',
        'orders --{time}': 'View orders placed in {time} hours', 
        'order --{id}': 'Lookup the details of a specific order by it ID', 
        'users --{time}': 'View users who have signed up in the last {time} hours', 
        'user --{email}': 'Lookup the details of a specific user by email address', 
        'exit': 'Terminate CLI and server'
    };

    
 });

 ev.on('exit', (str) => {
    process.exit(0);
 });

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
        let cliCommands = [
            'menu',
            'orders',
            'order',
            'users',
            'user',
            'help',
            'exit'
        ];
        let command = input.trim().toLowerCase(),
            commandIndex = cliCommands.indexOf(command);
        //perform action if command exist in commands list
        if(commandIndex > -1) {
            ev.emit(input, commandIndex);
        } else {
            console.log(input + ' - is not recognizable command');
            console.log('Please, try again!');
        }
    }
 };

 module.exports = cli;