//Author: Ryan Chin
//HC: I pledge my honor that I have abided by the Stevens Honor System;
//Description: File that will handle error checking for varied inputs

function checkId(string) {
    if(!string) throw `Error: ${string}: ${string || "parameter"} not given`;
    if(typeof string !== 'string') throw `Error: ${string}: ${string || "parameter"} is not of type string.`;
    if(string.trim().length === 0) throw `Error: id parameter is just white space or empty.`;
    const val = Number(string);
    if(Number.isNaN(val)) throw `Error: id: ${string} is not a positive whole number.`;
    if(!Number.isInteger(val) || val<=0) throw `Error: id: ${string} is not a positive whole number.`;
}

function checkString(parameter, string) {
    if(!string) throw `Error: ${parameter}: ${string || "parameter"} not given`;
    if(typeof string !== 'string') throw `Error: ${parameter}: ${string || "parameter"} is not of type string.`;
    if(string.trim().length === 0) throw `Error: ${parameter} parameter is just white space or empty.`;
}

function checkArray(array) { //function that checks the validity of arrays
    if (!array) throw 'Error: no array inputed';
    if(!Array.isArray(array)) throw `Error input: ${array} is not of type array`;
    let arrLen = array.length;
    if (arrLen === 0) throw `Error: given array: ${array} is empty`;
}

function checkNumbersArray(array) { //function that checks the validity of the contents of the arrays
    array.forEach (element => {
        if (typeof element !== 'number') throw `Error: array content: '${element || 'provided variable'}', is not a number`;
        if (isNaN(element)) throw `Error: array content: ${element || 'provided variable'} , is NaN`;
    });
}

function checkStringsArray(array) { //function that checks the validity of the contents of the arrays
    array.forEach (element => {
        if (typeof element !== 'string') throw `Error: array content: '${element || 'provided variable'}', is not a string`;
        if(typeof element === 'string') checkString("element", element);
    });
}

function checkObj(object) {
    if(!object) throw `Error: Input: ${object || 'provided variable'} was not given.`;
    if(typeof object !== 'object') throw `Error: Input: ${object || 'provided variable'} , is not of type object.`;
}

function checkNum(num) {
    if(!num) throw `Error: Input: ${num || 'provided variable'} was not given.`;
    if(typeof num !== 'number') throw `Error: Input: ${num || 'provided variable'} , is not of type number.`;
}

function checkWebsite(website) {
    //check website url
    if(!website.includes("http://www.")) throw `Error: Website URL: ${website} does not contain the necessary: "http://www.".`;
    let urlLength = website.length;
    if(!(website.substring(urlLength-4) === (".com"))) throw `Error: Website URL: ${website} does not end in ".com".`;
    if(website.length < 20) throw `Error: Website URL: ${website} does not have at least 5 characters between the two required bits.`;
}

function checkYearFormed(year) {
   if(year < 1900 || year > 2022) throw `Error: Year ${year} is not within the allotted range: 1900-2022.`;
}

function checkDateHelp(month, day) {
    if(!month) throw `Error: month parameter: ${month} not given.`
    if(!day) throw `Error: day parameter: ${day} not given.`
    if(month<1 || month > 12) throw `Error: month: ${month} is out of range 1-12.`
    if(month === 2)
        if(day < 1 || day > 28) throw `Error: month: ${month} range: 1-28. Day: ${day} was given.`
    else if(month === 4 || month === 6 || month === 9 || month === 11) 
        if(day < 1 || day > 30) throw `Error: month: ${month} range: 1-30. Day: ${day} was given.`
    else
        if(day < 1 || day > 31) throw `Error: month: ${month} range: 1-31. Day: ${day} was given.`
}

function checkDate(date) {
    if(!date) throw "No date given!";
    if(date.length>10) throw `Date: ${date} is an invalid date.`;
    if(!date.charAt(2) === '/' || !date.charAt(5) === '/') throw `Date: ${date} is an invalid date.`;
    let dateArr = date.split("/");
    let month = dateArr[0];
    let day = dateArr[1];
    let year = dateArr[2];
    checkDateHelp(Number(month), Number(day));
    checkYearFormed(Number(year));
}

module.exports = { 
    checkString,
    checkArray,
    checkNumbersArray,
    checkObj,
    checkNum,
    checkStringsArray,
    checkId,
    checkWebsite,
    checkYearFormed,
    checkDate
}