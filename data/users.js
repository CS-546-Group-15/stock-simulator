const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validate = require("../validation.js");
let { ObjectId } = require("mongodb");

async function get(stockID){
    if (!ObjectId.isValid(stockID)) throw 'invalid stockID';
    const userCollection = await users();
    
    const stock = await userCollection.findOne({'user_stocks._id': ObjectId(stockID)},
        {projection: {'user_stocks.$': true}}
    );

    if(stock == null)
        throw "Stock couldn't be found";

    return stock.user_stocks[0];
}

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

    //TODO: API CALL
    let price_purchased = 0;
    let total_cost = 1500//price_purchased * shares;
    //then update liquid assets for user:
    if(total_cost > user.liquid_assets) throw "Can't add stocks worth more then you have";
    await changeLiquidAssets(userID, total_cost);

    let theID = new ObjectId();
    const userComment = {
        _id: ObjectId(theID),
        ticker: stock,
        num_shares: shares,
        price_purchased: price_purchased,
        total_cost: total_cost,
        date_time: date_time
    };

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
    throw "Could not add comment to post";

    return userComment;
}

async function sellStockForUser(stockID){
    if (!ObjectId.isValid(stockID)) throw "invalid object ID";
    const userCollection = await users();

    const parent = await userCollection.findOne(
        {"user_stocks._id": ObjectId(stockID)}
    );
    let soldStock = await get(stockID);

    await userCollection.updateOne( {_id: parent._id}, 
        { $pull : { user_stocks : {"_id": ObjectId(stockID)} } }, false, false );

    //add it back to liquid assets
    await changeLiquidAssets(parent._id, soldStock.total_cost * (-1));
    return soldStock;
}

async function changeLiquidAssets(userID, amount){
    await validate.checkNum(amount);
    if (!ObjectId.isValid(userID)) throw 'invalid object ID';
    
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });
    if (!user) throw "User doesn't exist with that Id";

    let updatedAmount = user.liquid_assets - amount;

    await userCollection.updateOne(
        {_id: ObjectId(userID)},
        [{ $set: {liquid_assets: updatedAmount}}
    ]);

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
    addStockToUser,
    sellStockForUser
};