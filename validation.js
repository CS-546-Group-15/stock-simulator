//for checking ObjectId
const { ObjectId } = require("mongodb");

/*
    ERROR CHECKS IN ROUTES
*/

function checkUsername(username) {
    if (!username) throw "Must provide a username";
    if (typeof username != 'string') throw "Username must be a string";
    if (username.trim().length < 4) throw "Username must be at least 4 characters long";
    for (character of username) {
        if (character == ' ') {
            throw "username must not contain spaces.";
        }
    }
    username = username.trim();
    //https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    //method of checking alphanumeric adapted from this source
    for (let i = 0; i < username.length; i++) {
        let code = username.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
                throw "username is non-alphanumeric"; 
            }
    }
}

function checkPassword(password) {
    if (!password) throw "Must provide a password";
    if (typeof password != 'string') throw "Password must of type string";
    if (password.trim().length < 6) throw "Password must be at least 6 characters long"
    for (character of password) {
        if (character == ' ') {
            throw "password must not contain spaces.";
        }
    }
}

function checkEmail(email) {
    if (!email) throw "Must provide an email address";
    //
    //implement
    //
}


/*
    ERROR CHECKS IN DATA
*/

//
//  POSTS
//
function checkCreatePost(userID, title, info) {
    if (!userID) throw "Must provide a user ID";
    if (!title) throw "Must provide a title";
    if (!info) throw "Must provide info";

    //need to further define these to check them
}

function checkUpdatePost(postID, userID, title, info) {
    if (!postID) throw "Must provide a post ID";
    if (!userID) throw "Must provide a user ID";
    if (!title) throw "Must provide a title";
    if (!info) throw "Must provide info";

    //need to further define these to check them
}

function checkCreateComment(postID, userID, comment) {
    if (!postID) throw "Must provide a post ID";
    if (!userID) throw "Must provide a user ID";
    if (!comment) throw "Must provide a comment";

    //need to further define these to check them
}

function checkRemoveComment(commentID) {
    if (!commentID) throw "Must provide a comment ID";

    //probably just need to check if valid object ID.
}

//
//  USERS
//

module.exports = {
    checkUsername,
    checkPassword,
    checkEmail,
    checkCreatePost,
    checkUpdatePost,
    checkCreateComment,
    checkRemoveComment,
};
