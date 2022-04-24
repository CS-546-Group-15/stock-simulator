async function checkString(str, par) {
    str = str.trim();
    if(!str || str === undefined || typeof str !== "string") throw `${par} must exist and be a string.`;
    if(str.replace(/\s/g, '').length === 0) throw  `${par} must have character count > 0`;
    return str;
}

async function checkStringInArr(str, par) {
    if(!str || str === undefined || typeof str !== "string") throw `All variables in array, ${par}, must exist and be a string`;
    if(str.replace(/\s/g, '').length === 0) throw `All variables in array, ${par}, must have character count > 0`;
    return;
}

async function checkArr(arr, par) {
    if(!Array.isArray(arr) || arr == undefined) 
        throw `${arr | "Variable"} is not an array or is undefined for ${par}`;
    if(arr.length < 1)
        throw `Array is empty for ${par}`;
    for(const element of arr){
        await checkStringInArr(element);
    }
}

function checkNumbersArray(array) { //function that checks the validity of the contents of the arrays
    array.forEach (element => {
        if (typeof element !== 'number') throw `Error: array content: '${element || 'provided variable'}', is not a number`;
        if (isNaN(element)) throw `Error: array content: ${element || 'provided variable'} , is NaN`;
    });
}

async function checkYear(num){
    if(typeof num !== 'number' || isNaN(num)) throw `${num || 'yearFormed'} is not a valid number`;
    if(num < 1900 || num > 2022) throw `${num || 'yearFormed'} must be between 1900-2022`;
    return;
}

async function checkWebsite(str){
    str = str.trim();
    if(!(str.substring(0,11).toLowerCase() === "http://www.") || !(str.substring(str.length - 4).toLowerCase() === ".com"))
        throw "website must include 'http://www.' and have '.com' be the last four characters"
    if(str.length < 20) throw "website url must have atelast 5 characters between 'www.' and '.com'."
    return str;
}

async function checkNum(num) {
    if(!num) throw `Error: Input: ${num || 'provided variable'} was not given.`;
    if(typeof num !== 'number') throw `Error: Input: ${num || 'provided variable'} , is not of type number.`;
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

async function checkUsername(str){
    await checkString(str, "Username");
    if(/\s/g.test(str))
        throw "Username must not inculude any spaces!";
    if(str.length < 4)
        throw "Username must include more than 4 characters!";
}

async function checkPassword(str){
    await checkString(str, "Password");
    if(/\s/g.test(str))
        throw "Password must not inculude any spaces!";
    if(str.length < 6)
        throw "Password must include more than 6 characters!";
}
//email validation gotten from https://stackoverflow.com/questions/940577/javascript-regular-expression-email-validation
async function checkEmail(email) {
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email))
        throw 'Email must be valid addresss!'
}


module.exports = {
    checkString,
    checkStringInArr,
    checkNumbersArray,
    checkArr,
    checkYear,
    checkWebsite,
    checkNum,
    checkDate,
    checkDateHelp,
    checkUsername,
    checkPassword,
    checkEmail
};
