const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");
const res = require("express/lib/response");


//  get every post in the database
async function getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
}

//  get posts that are associated with the given tag
async function getPostsByTag(tag) {
    if (!tag) throw 'No tag provided';
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
}

//  gets a singular post based off of its id
async function getPostById(id) {
    if (!id) throw 'No ID provided';
    const postCollection = await posts();
    id = ObjectId(id);
    const post = await postCollection.findOne({_id: id});
    if (!post) throw 'Post not found';
    return post;
}

//  gets a specific comment by a given id
async function getPostByCommentId(commentId){
    validation.checkGetComment(commentId);

    const postCollection = await posts();
    const parent = await postCollection.findOne(
        { "comments._id": ObjectId(commentId) }
    );
    const post = await postCollection.findOne({ _id: ObjectId(parent._id) });
    return post;
}

//  creates a post to be displayed on the discussion page
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

//  allows for posts to be edited
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

//  gives a user the ability to remove their post
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

//  allows users to leave comments on a post
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

//  lets users remove their comment if they are the owner of it
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

//  allows for users who own a comment to alter it
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
