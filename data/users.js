const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require("../validation.js");
// const { ObjectId } = require("mongodb"); PROBABLY DON'T NEED THIS



async function createUser(username, password) {
    //Ensures no errors in email/username/password entry. 
    validation.checkUsername(username);
    validation.checkPassword(password);
    
    // format inputs
    username = username.trim().toLowerCase();
    password = password.trim();

    // get users collection
    const userCollection = await users();

    // check for duplicate usernames
    const test = await userCollection.findOne({ username: username });
    if(test!==null) throw 'Error: there is already a user with the given username';

    // password hash
    const hashPassword = await bcrypt.hash(password, saltRounds);

    //starts a new user off with $10,000
    let newUser = {
        "username": username,
        "password": hashPassword,
        "cash": 10000,
        "efficiency": 0,
        "stocks": []
    }

    // add user to database
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertInfo === 0) throw 'Could not add user';
    return { userInserted: true }; // return an insert confirmation
}

async function getUser(username) {
    // validate inputs
    validation.checkUsername(username);
    
    // format inputs
    username = username.trim().toLowerCase();

    // get user collection
    const userCollection = await users();

    // get user
    const user = await userCollection.findone({ username: username });
    if(user === null) throw `no user found with username ${username}`;
    return user;
}

async function checkUser(username, password) {
    // validate inputs
    validation.checkUsername(username);
    validation.checkPassword(password);

    // format inputs
    username = username.trim().toLowerCase();
    password = password.trim();

    // get users collection
    const userCollection = await users();

    // try to get user
    const user = await userCollection.findOne({ username: username });
    if(user === null) throw 'Either the username or password is invalid'; 
    const compare = await bcrypt.compare(password, user.password); // check if hashed password matches
    if(!compare) throw 'Either the username or password is invalid';
    return { authenticated: true }; // authenticate
}

async function getAllUsers() {
    // get users collection
    const userCollection = await users();

    // get list of users
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'Could not get all users';
    return userList; // return user list
}

module.exports = {
    createUser,
    getUser,
    checkUser,
    getAllUsers
};