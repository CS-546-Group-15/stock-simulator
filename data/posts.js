const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");
const res = require("express/lib/response");


<<<<<<< Updated upstream
//  get every post in the database
=======
/*
    Display all posts so far in discussion (might limit to certain amount)
*/
>>>>>>> Stashed changes
async function getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
}

<<<<<<< Updated upstream
//  get posts that are associated with the given tag
=======

/*
    Get a post by a specific tag, look for specific keywords/stocks
*/
>>>>>>> Stashed changes
async function getPostsByTag(tag) {
    if (!tag) throw 'No tag provided';
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
}

<<<<<<< Updated upstream
//  gets a singular post based off of its id
=======

/*
    Gets a post by ID, used for getting a specific post
*/
>>>>>>> Stashed changes
async function getPostById(id) {
    if (!id) throw 'No ID provided';
    const postCollection = await posts();
    id = ObjectId(id);
    const post = await postCollection.findOne({_id: id});
    if (!post) throw 'Post not found';
    return post;
}

<<<<<<< Updated upstream
//  gets a specific comment by a given id
=======

/*
    Gets a post by commentID
*/
>>>>>>> Stashed changes
async function getPostByCommentId(commentId){
    validation.checkGetComment(commentId);

    const postCollection = await posts();
    const parent = await postCollection.findOne(
        { "comments._id": ObjectId(commentId) }
    );
    const post = await postCollection.findOne({ _id: ObjectId(parent._id) });
    return post;
}

<<<<<<< Updated upstream
//  creates a post to be displayed on the discussion page
=======

/*
    A post is the main discussion, comments will be added to it.
*/
>>>>>>> Stashed changes
async function createPost(userID, title, info, tags) {
    //error check inputs
    validation.checkCreatePost(userID, title, info, tags);

    let date_time = new Date().toUTCString();

    //import databases and ensure user exists
    const postCollection = await posts();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });

    if (!user) throw "User doesn't exist with that Id"; // no user found
    tagsArr = tags.split(",");
    // new post
    let newPost = {
        userID: userID,
        username: user.username,
        title: title,
        info: info,
        utc_date: date_time,
        tags: tagsArr, 
        comments: [],
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertInfo === 0) throw "Could not add User.";
    return newPost;
}

<<<<<<< Updated upstream
//  allows for posts to be edited
=======

/*
    Updates the contents of a post
*/
>>>>>>> Stashed changes
async function updatePost(postID, userID, title, info, tags) {
    //error check inputs
    validation.checkUpdatePost(postID, userID, title, info, tags);

    let date_time = new Date().toUTCString();

    //import databases and ensure post and user exists
    const postCollection = await posts();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });
    const post = await postCollection.findOne({ _id: ObjectId(postID) });

    if (!user) throw "User doesn't exist with that Id";
    if (!post) throw "Post doesn't exist with that Id";

    let updatedPost = {
        userID: userID,
        username: user.username,
        title: title,
        info: info,
        utc_date: date_time,
        tags: tags,
        comments: post.comments,
    };

    const updateInfo = await postCollection.updateOne(
        { _id: ObjectId(postID) },
        { $set: updatedPost }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw "Error: Update failed";
    return updateInfo;
}

<<<<<<< Updated upstream
//  gives a user the ability to remove their post
=======

/*
    Removes a post by ID
*/
>>>>>>> Stashed changes
async function removePost(id) {
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      return;
    }
    const deletionInfo = await postCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    return true;
}

<<<<<<< Updated upstream
//  allows users to leave comments on a post
=======

/*
    Creates a comment
*/
>>>>>>> Stashed changes
async function createComment(postID, userID, comment) {
    //error check inputs
    validation.checkCreateComment(postID, userID, comment);

    let date_time = new Date().toUTCString();

    const postCollection = await posts();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });
    const post = await postCollection.findOne({ _id: ObjectId(postID) });

    if (!user) throw "User doesn't exist with that Id";
    if (!post) throw "Post doesn't exist with that Id";

    let theID = new ObjectId();
    const userComment = {
        _id: ObjectId(theID),
        username: user.username,
        comment: comment,
        utc_date: date_time,
    };

    post.comments.push(userComment);

    const updateInfo = await postCollection.updateOne(
        { _id: ObjectId(postID) },
        {
            $addToSet: {
                comments: {
                    _id: ObjectId(theID),
                    username: user.username,
                    comment: comment,
                    utc_date: date_time,
                },
            },
        }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw "Could not add comment to post";

    return userComment;
}

<<<<<<< Updated upstream
//  lets users remove their comment if they are the owner of it
=======

/*
    Removes a comment by ID
*/
>>>>>>> Stashed changes
async function removeComment(commentID) {
    //error check inputs
    validation.checkRemoveComment(commentID);

    const postCollection = await posts();

    const parent = await postCollection.findOne(
        { "comments._id": ObjectId(commentID) }
    );
    const updateInfo = await postCollection.updateOne({ _id: parent._id },
        { $pull: { comments: { "_id": ObjectId(commentID) } } }, false, false);
    if(updateInfo === 0) `Could not delete comment.`
}

//  gets a specific comment by its respective ID
async function getCommentById(commentId){
    validation.checkGetComment(commentId);
    const postCollection = await posts();
    
    const comment = await postCollection.findOne({'comments._id': ObjectId(commentId)},
        {projection: {'comments.$': true}}
    );

    if(comment == null)
        throw "Album couldn't be found";

    return comment.comments[0];
}

<<<<<<< Updated upstream
//  allows for users who own a comment to alter it
=======

/*
    Updates a comment by ID
*/
>>>>>>> Stashed changes
async function updateComment(commentId, comment){
    //error check inputs
    validation.checkUpdateComment(commentId, comment);
    let date_time = new Date().toUTCString();

    const postCollection = await posts();
    const postComment = await getCommentById(commentId);

    const parent = await postCollection.findOne(
        { "comments._id": ObjectId(commentId) }
    );
    const post = await postCollection.findOne({ _id: ObjectId(parent._id) });

    const updateInfo = await postCollection.updateOne({_id: post._id, "comments._id": commentId},
        {"$set": {"comments.$.comment": comment, "comments.$.utc_date": date_time}}    
    );
}

module.exports = {
    getAllPosts,
    getPostsByTag,
    getPostById,
    getPostByCommentId,
    createPost,
    updatePost,
    removePost,
    createComment,
    removeComment,
    getCommentById,
    updateComment
};
