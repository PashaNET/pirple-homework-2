
/**
 * Module responsible for creating html templates for pages
 */

//Dependencies 
const fs = require('fs'),
      path = require('path'),
      config = require('../config');


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
    //merdge with params 

    for(let key in globalParams){
        if(globalParams.hasOwnProperty(key)){
            let find = '{global.' + key + '}';
            //{global.companyName}
            template = template.replace(find, globalParams[key]);
            //TODO indexOf??
            let t = '';
        }
    }
    return template;
}

/**
 * 
 * @param {*} pageName 
 * @param {*} data 
 * @param {*} callback 
 */
function preparePageTemlate(data, callback){
    let pageName = 'index';

    getTemplate(pageName, data, (err, template) => {
        if(!err){
            callback(false, template);
        } else {

        }
    });
}

module.exports = preparePageTemlate;