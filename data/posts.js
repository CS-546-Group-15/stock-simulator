const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const validation = require("../validation.js");
const { ObjectId } = require("mongodb");
const res = require("express/lib/response");

//  Display all posts so far in discussion (might limit to certain amount)
async function getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
}

//  Get a post by a specific tag, look for specific keywords/stocks
async function getPostsByTag(tag) {
    if (!tag) throw 'No tag provided';
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
}

//  Gets a post by ID, used for getting a specific post
async function getPostById(id) {
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: id});

    if (!post) throw 'Post not found';
    return post;
}

//a post is the main discussion, comments will be added to it.
async function createPost(userID, title, info, tags) {
    //error check inputs
    validation.checkCreatePost(userID, title, info, tags);

    let date_time = new Date().toUTCString();

    //import databases and ensure user exists
    const postCollection = await posts();
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userID) });

    if (!user) throw "User doesn't exist with that Id"; // no user found

    // new post
    let newPost = {
        userID: userID,
        username: user.username,
        title: title,
        info: info,
        utc_date: date_time,
        tags: tags, 
        comments: [],
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertInfo === 0) throw "Could not add User.";
    return newPost;
}

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

async function removePost(id) {
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      return;
    }
    const deletionInfo = await postCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    await users.removePostFromUser(post.poster.id, id);
    return true;
}

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

async function removeComment(commentID) {
    //error check inputs
    validation.checkRemoveComment(commentID);

    const postCollection = await posts();

    const parent = await postCollection.findOne(
        { "comments._id": ObjectId(commentID) }
    );
    await postCollection.updateOne({ _id: parent._id },
        { $pull: { comments: { "_id": ObjectId(commentID) } } }, false, false);
}

module.exports = {
    getAllPosts,
    getPostsByTag,
    getPostById,
    createPost,
    updatePost,
    removePost,
    createComment,
    removeComment
};
