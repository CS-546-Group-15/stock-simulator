const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const validate = require("../validation.js");
let { ObjectId } = require("mongodb");

//a post is the main discussion, comments will be added to it.
async function createPost(userID, title, info) {
  if (!ObjectId.isValid(userID)) throw "invalid object ID";
  title = await validate.checkString(title, "title");
  info = await validate.checkString(info);
  let date_time = new Date().toUTCString();

  //import databases and ensure user exists
  const postCollection = await posts();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userID) });

  if (!user) throw "User doesn't exist with that Id";

  let newPost = {
    userID: userID,
    username: user.username,
    title: title,
    info: info,
    utc_date: date_time,
    comments: [],
  };

  const insertInfo = await postCollection.insertOne(newPost);
  if (insertInfo.insertInfo === 0) throw "Could not add User.";
  return newPost;
}

async function updatePost(postID, userID, title, info) {
  if (!ObjectId.isValid(postID)) throw "invalid object ID";
  if (!ObjectId.isValid(userID)) throw "invalid object ID";
  title = await validate.checkString(title, "title");
  info = await validate.checkString(info);
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

module.exports = {
  createPost,
  updatePost
};
