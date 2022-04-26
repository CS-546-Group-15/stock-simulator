const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");

async function getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    if (!user) throw 'User not found';
    return user;
} 

async function createUser(username, password) {
    //Ensures no errors in email/username/password entry. 
    validation.checkUsername(username);
    validation.checkPassword(password);

    //Also make sure unique username isn't taken and has unique email!
    // check for duplicate email and username
    // TODO: REWORK

    // get users collection
    const userCollection = await users();

    // check for duplicate usernames
    const test = await userCollection.findOne({ username: username });
    if(test!==null) throw 'Error: there is already a user with the given username';

    const hashPassword = await bcrypt.hash(password, saltRounds);

    //starts a new user off with $10,000
    let newUser = {
        "username": username,
        "password": hashPassword,
        "cash": 10000,
        "efficiency": 0,
        "posts":  [],
        "stocks": []
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertInfo === 0) throw 'Could not add user';
    return { userInserted: true };
}






// TODO: REWORK FUNCTION
async function checkUser(username, password) {
    // TODO: validate inputs

    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    let __foundFlag = false;
    let actualPassword = "";


    // NEEDS TO BE FIXED
    for(var user in userList){
        if(userList[user].username.toString().toLowerCase() == username.toLowerCase()){
            __foundFlag = true;
            actualPassword = userList[user].password.toString();
        }
    }

    if(!__foundFlag)
        throw "Either the username or password is invalid";
    
    try{
        compareToMatch = await bcrypt.compare(password, actualPassword);
    } catch (e) {
        throw "Either the username or password is invalid";
    }

    if (compareToMatch) return {authenticated: true};
    else throw "Either the username or password is invalid";

}

async function addPostToUser(userId, postId, postTitle) {
    let currentUser = await this.getUserById(userId);
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: {posts: {id: postId, title: postTitle} }}
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await this.getUserById(userId);
}

async function removePostFromUser(userId, postId) {
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { posts: {id: postId} } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await this.getUserById(userId);
}

module.exports = {
    getUserById,
    createUser,
    checkUser,
    addPostToUser,
    removePostFromUser
};