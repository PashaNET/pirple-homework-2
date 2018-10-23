
/**
 * Module responsible for creating html templates for pages
 */

//Dependencies 
const fs = require('fs'),
      path = require('path'),
      config = require('../config'),
      validators = require('../servises/validators');

let pageHandlers = {
    'index': indexHandler
}

function indexHandler(data, callback){
    let pageName = 'index';
    let indexData = {
        title: 'Home page',
        text: 'Hello world'
    };

    getTemplate(pageName, indexData, (err, template) => {
        if(!err){
            callback(false, template, 'html');
        } else {
            callback(true, err, 'html');
        }
    });
}

function getTemplate(pageName, pageData, callback){
    let pathToTemplate = path.join(__dirname, pageName + '.html');

    fs.readFile(pathToTemplate, 'utf8', (err, str) => {
        if(!err){
            addUniversalTemplateParts(str, (err, fullTemplateStr) => {
                if(!err){
                    let finalStr = interpolate(fullTemplateStr, pageData);
                    callback(false, finalStr);
                } else {
                    callback(err, {message: 'Can\'t read universal templates'});
                }
            });
        } else {
            callback(err, {message: 'Can\'t read template file'});
        }
    });
}

function addUniversalTemplateParts(templateStr, callback){
    let pathToHeaderTemplate = path.join(__dirname, 'layout', 'header.html');
    fs.readFile(pathToHeaderTemplate, 'utf8', (err, headerStr) => {
        if(!err){
            let pathToFooterTemplate = path.join(__dirname, 'layout', 'footer.html');
            fs.readFile(pathToFooterTemplate, 'utf8', (err, footerStr) => {
                if(!err){
                    callback(false, headerStr+templateStr+footerStr);
                } else {
                    callback(err, {message: 'Can\'t read footerTemplate'});
                }
            });
        } else {
            callback(err, {message: 'Can\'t read headerTemplate'});
        }
    });
}

/**
 * replace keys in template with values
 * @param {*} params 
 */
function interpolate(template, params){
    let globalParams = config.globalTemplateData;

    //replace global variables 
    for(let key in globalParams){
        if(globalParams.hasOwnProperty(key)){
            let find = '{global.' + key + '}';
            template = template.replace(find, globalParams[key]);
        }
    }

    //replace all related to page variables
    for(let key in params){
        if(params.hasOwnProperty(key)){
            let find = '{' + key + '}';
            template = template.replace(find, params[key]);
        }
    }

    return template;
}


module.exports = pageHandlers;