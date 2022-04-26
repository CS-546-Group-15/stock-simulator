const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");

async function getStock(stockID){
    // TODO: validate inputs
    const userCollection = await users();
    
    const stock = await userCollection.findOne({'user_stocks._id': ObjectId(stockID)},
        {projection: {'user_stocks.$': true}}
    );

    if(stock === null)
        throw "Stock couldn't be found";

    return stock.user_stocks[0];
}

async function createUser(email, username, password){
    //Ensures no errors in email/username/password entry. 
    //Also make sure unique username isn't taken and has unique email!
    // TODO: validate inputs
    // check for duplicate email and username
    // TODO: REWORK

    const userCollection = await users();

    const hashPassword = await bcrypt.hash(password, saltRounds);

    //starts a new user off with $10,000
    let newUser = {
        "username": username,
        "email": email,
        "password": hashPassword,
        "cash": 10000,
        "efficiency": 0,
        "user_stocks": []
    }

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertInfo === 0)
      throw 'Could not add User';
    return newUser;
}

async function buyStock(userID, stock, shares){
    // TODO: validate inputs


    let date_time = new Date().toUTCString();

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });

    if (!user) throw "User doesn't exist with that Id";

    //TODO: API CALL
    let price_purchased = 0;
    let total_cost = 1500//price_purchased * shares;

    const stock = {
        _id: ObjectId(),
        ticker: stock,
        num_shares: shares,
        price_purchased: price_purchased,
        total_cost: total_cost,
        date_time: date_time
    };

    // TODO: combine with following update: update cash
    await userCollection.updateOne(
        {_id: ObjectId(userID)},
        [{ $set: {cash: user.cash - total_cost }}
    ]);

    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userID) },
        {
          $addToSet: {
            user_stocks: {
                _id: ObjectId(theID),
                ticker: stock,
                num_shares: shares,
                price_purchased: price_purchased,
                total_cost: total_cost,
                date_time: date_time
            },
          },
        }
      );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Could not purchase stock";

    return stock;
}

async function sellStock(userID, stock, shares) {
    // TODO: validate inputs
    const userCollection = await users();

    // TODO: needs to be rewritten
}


// TODO: REWORK FUNCTION
async function checkUser(username, password){
    // TODO: validate inputs

    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    let __foundFlag = false;
    let actualPassword = "";


    // DO NOT DO THIS
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
    addStockToUser,
    sellStockForUser
};