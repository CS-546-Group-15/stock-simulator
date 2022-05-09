//for checking ObjectId
const { ObjectId } = require("mongodb"); // MIGHT NOT NEED THIS

function checkUsername(username) {
    if (!username) throw "Must provide a username";
    if (typeof username !== 'string') throw "Username must be a string";
    if (username.trim().length < 4) throw "Username must be at least 4 characters long";
    for (character of username) {
        if (character === ' ') {
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
    if (typeof password !== 'string') throw "Password must of type string";
    if (password.trim().length < 6) throw "Password must be at least 6 characters long"
    for (character of password) {
        if (character === ' ') {
            throw "Password must not contain spaces.";
        }
    }
}

//
//  POSTS
//
function checkCreatePost(userID, title, info, tags) {
    if (!userID) throw "Must provide a user ID";
    if (!title) throw "Must provide a title";
    if (!info) throw "Must provide info";
    if (!tags) throw "Must provide tags";

    if (!ObjectId.isValid(userID)) throw "user ID is not valid object id";

    if (typeof title !== 'string') throw "title must be of type string";
    if (typeof info !== 'string') throw "info must be of type string";
    //PLEASE CHECK TYPE OF TAGS, I DONT KNOW

    if (title.trim().length < 1) throw "title must be nonempty";
    if (info.trim().length < 1) throw "info must be nonempty";
}

function checkUpdatePost(postID, userID, title, info, tags) {
    if (!postID) throw "Must provide a post ID";
    if (!userID) throw "Must provide a user ID";
    if (!title) throw "Must provide a title";
    if (!info) throw "Must provide info";
    if (!tags) throw "Must provide tags";

    if (!ObjectId.isValid(postID)) throw "post ID is not valid object id";
    if (!ObjectId.isValid(userID)) throw "user ID is not valid object id";

    if (typeof title !== 'string') throw "title must be of type string";
    if (typeof info !== 'string') throw "info must be of type string";
    //PLEASE CHECK TYPE OF TAGS, I DONT KNOW

    if (title.trim().length < 1) throw "title must be nonempty";
    if (info.trim().length < 1) throw "info must be nonempty";
    
}

function checkCreateComment(postID, userID, comment) {
    if (!postID) throw "Must provide a post ID";
    if (!userID) throw "Must provide a user ID";
    if (!comment) throw "Must provide a comment";

    if (!ObjectId.isValid(postID)) throw "post ID is not valid object id";
    if (!ObjectId.isValid(userID)) throw "user ID is not valid object id";

    if (typeof comment !== 'string') throw "comment must be of type string";
    if (comment.trim().length < 1) throw "comment must be nonempty";
}

function checkRemoveComment(commentID) {
    if (!commentID) throw "Must provide a comment ID";
    if (!ObjectId.isValid(commentID)) throw "comment ID is not valid object id";
}

function checkGetComment(commentId){
    if(!commentId) throw "Must provide a comment ID";

    if (!ObjectId.isValid(commentId)) throw "comment ID is not valid object id";
}

function checkUpdateComment(commentId, comment){
    if(!commentId) throw "Must provide a comment ID";
    if(!comment) throw "Must provide a comment";

    if (!ObjectId.isValid(commentId)) throw "comment ID is not valid object id";
    
    if (typeof comment !== 'string') throw "comment must be of type string";
    if (comment.trim().length < 1) throw "comment must be nonempty"

}

function checkSymbol(symbol) {
    if (!symbol) throw "Must provide a symbol";
    if (typeof symbol !== 'string') throw "Symbol must be of type string";
    if (symbol.trim().length < 1) throw "Symbol must be nonempty";
    if (symbol.trim().length > 5) throw "Symbol invalid, must be 5 or fewer characters long";
    symbol = symbol.toLowerCase();
    symbol = symbol.trim();

    //make sure symbol has no spaces and only letters
    for (let i = 0; i < symbol.length; i++) {
        let code = symbol.charCodeAt(i);
        if (symbol.charAt(i) === ' ') throw "Symbol cannot contain spaces";
        if (!(code > 96 && code < 123)) throw "Symbol must only contain letters";
    }    
}

function checkId(id) {
    if(!id) throw 'must provide a valid id';
    if(typeof id !== 'string') throw 'id must be of type string';
    if(id.length < 1) throw 'id is an empty string';
    if(id.trim().length < 1) throw 'id consists of only spaces';
    if(!ObjectId.isValid(id)) throw 'id must be a valid ObjectId';
}

function checkShares(shares) {
    if(!shares) throw 'must provide a valid number';
    shares = Number(shares);
    if(typeof shares !== 'number') throw 'shares must be of type number';
    if(shares < 1 || !Number.isInteger(shares) || isNaN(shares)) throw 'shares must be a positive whole number';
    // TODO: need to add more checks for thoroughness
}

module.exports = {
    checkUsername,
    checkPassword,
    checkCreatePost,
    checkUpdatePost,
    checkCreateComment,
    checkRemoveComment,
    checkUpdateComment,
    checkGetComment,
    checkSymbol,
    checkId,
    checkShares
};
