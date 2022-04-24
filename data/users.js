const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validate = require("../validation.js");


async function createUser(email, username, password){
    //Ensures no errors in email/username/password entry. 
    //Also make sure unique username isn't taken and has unique email!
    await validate.checkEmail(email); await validate.checkUsername(username); await validate.checkPassword(password); 
    await checkDupes(username, "username"); await checkDupes(email, "email");
    const hashPassword = await bcrypt.hash(password, saltRounds);


    const userCollection = await users();

    //starts a new user off with $10,000
    let newUser = {
        "username": username,
        "email": email,
        "password": hashPassword,
        "liquid_assets": 10000,
        "efficiency": 0,
        "user_stocks": []
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertInfo === 0)
      throw 'Could not add User.';
    return newUser;
}



async function checkDupes(entry, field){
    await validate.checkString(entry, field);

    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();

    for(var user in userList){
        if(field == "username"){
            if(userList[user].username.toString().toLowerCase() == entry.toLowerCase())
                throw `User already exists with that ${field}!`;
        } else if(field == "email"){
            if(userList[user].email.toString().toLowerCase() == entry.toLowerCase())
                throw `User already exists with that ${field}!`;
        }
    }
}


module.exports = {
    createUser
};