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

async function addStockToUser(userID, stock, shares){
    if (!ObjectId.isValid(userID)) throw "invalid object ID";
    stock = await validate.checkString(stock, "stock");
    shares = await validate.checkShares(shares);
    let date_time = new Date().toUTCString();

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });

    if (!user) throw "User doesn't exist with that Id";

    let theID = new ObjectId();
    const userComment = {
      _id: ObjectId(theID),
      username: user.username,
      comment: comment,
      utc_date: date_time,
    };

    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(postID) },
        {
          $addToSet: {
            user_stocks: {
              _id: ObjectId(theID),
              ticker: stock,
              num_shares: shares,
              price_purchased: 0,
              date_time: date_time
            },
          },
        }
      );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Could not add comment to post";

    return userComment;
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

async function checkUser(username, password){
    await validate.checkUsername(username);
    await validate.checkPassword(password);

    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    let __foundFlag = false;
    let actualPassword = "";

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

module.exports = {
    createUser,
    checkUser,
    addStockToUser
};