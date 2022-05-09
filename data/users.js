const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const postsCollection = mongoCollections.posts;
const bcrypt = require('bcrypt');
const saltRounds = 12;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");
// const data = require('../data');
const postData = require('./posts.js');

async function getUserById(id) {
    // validate inputs
    validation.checkId(id);

    // format inputs
    id = id.trim();

    // get user from collection
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw `No user found with id ${id}`;

    return user;
} 

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
    return { userCreated: true }; // return an insert confirmation
}

async function getUser(username) {
    // validate inputs
    validation.checkUsername(username);
    
    // format inputs
    username = username.trim().toLowerCase();

    // get user collection
    const userCollection = await users();

    // get user
    const user = await userCollection.findOne({ username: username });
    if(user === null) throw `No user found with username ${username}`;
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
    return userList; // reverted back to this for now
    // return userList.sort((x,y) => (x.cash > y.cash) ? -1 : ((y.cash > x.cash) ? 1 : 0)); // return user list sorted in decending order by cash
}

async function updateUsername(username, newUsername) {
    //validate inputs
    validation.checkUsername(username);
    validation.checkUsername(newUsername);

    //get user
    let updatedUser = await getUser(username);
    // console.log(username);
    //replace old with new
    updatedUser.username = newUsername;
    
    const userCollection = await users();
    const postCollection = await postsCollection();
    let postsList = await postData.getAllPosts();
    for(let i = 0; i<postsList.length;i++) {
        if(postsList[i].username === username) {
            let updatedPost = {
                username: newUsername
            }
            let updateInfo = await postCollection.updateOne(
                { username: username },
                { $set: updatedPost }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Error: Update failed";
            // for(var comment in postsList[i]) {
            //     console.log(postsList[i][comment]);
            //     // console.log(postsList[i].comment);
            //     if(postsList[i][comment].username === username) {
            //         await postData.updateComment(postsList[i].comments._id, newUsername);
            //     }
            // }
        }
    }
    // posts.forEach(post => {
    //     if(post.username === username ) {
    //         let updatedPost = {
    //             username: newUsername
    //         }
    //         const updateInfo = await postCollection.updateOne(
    //             { username: username },
    //             { $set: updatedPost }
    //         );
    //         if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Error: Update failed";
    //     }
    //     post.comments.forEach(comment => {
    //         if(comment.username === current) comment.username = newUsername;
    //     });
    // });
    //update
    const updatedInfo = await userCollection.updateOne(
        { username: username},
        { $set: updatedUser }
    );
    if (updatedInfo.modifiedCount !== 1) throw "Failed to update username"
    return;
}

async function updatePassword(username, newPassword) {
    //validate inputs
    validation.checkUsername(username);
    validation.checkPassword(newPassword);

    //get user
    let updatedUser = await getUser(username);
    
    //hash new password
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    //replace old with new
    updatedUser.password = hashPassword;
    
    const userCollection = await users();

    //update
    const updatedInfo = await userCollection.updateOne(
        { username: username },
        { $set: updatedUser }
    );
    if (updatedInfo.modifiedCount !== 1) throw "Failed to update password"
    return;
}

module.exports = {
    getUserById,
    createUser,
    checkUser,
    getUser,
    checkUser,
    getAllUsers,
    updateUsername,
    updatePassword
};