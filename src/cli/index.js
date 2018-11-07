/**
 *  CLI Tasks
 */

 //Dependencies
 let validators = require('../servises/validators'),
     readline = require('readline'),
     util = require('util'),
    //  debug = require('debug'),
     events = require('events');

class Events extends events{

}

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
        let cliCommands = [
            'menu',
            'orders', //past 24 hours
            'order', //details of a specific order
            'users', //signed upt for last 24 hours
            'user' //details of a specific user
        ];

        let command = input.trim().toLowerCase(),
            commandIndex = cliCommands.indexOf(command);
        //perform action if command exist in commands list
        if(commandIndex > -1) {
            ev.emit(commandIndex, input);
        } else {
            console.log(input + ' - is not recognizable command');
            console.log('Please, try again!');
        }
    }
 };

 module.exports = cli;