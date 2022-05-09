const express = require('express');
const router = express.Router();
const validation = require('../validation');
const data = require('../data');
const { getUserById, getUser } = require('../data/users');
const { getAllPosts } = require('../data/posts');
const postData = data.posts;
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
//show discussion page
router.get('/', async (req, res) => {
  if(req.session.user) {
        let posts = await getAllPosts();
        res.render('posts/discussion', {authenticated: true, posts: posts});
    } else {
        let posts = await getAllPosts();
        res.render('posts/discussion', {authenticated: false, posts: posts});
    }
    return;
});

//show discussion page
router.get('/newPost', async (req, res) => {
    if(req.session.user) {
        res.render('posts/newPost', {authenticated: true});
    } else {
        res.render('display/login', {error: 'Please log in to make a new post.'});
    }
    return;
  });
  
//  Get a specific blog post by id
router.get('/:id', async (req, res) => {
  let authenticatedQ = (req.session.user) ? true : false
  let authUser = "";
  if(authenticatedQ)
    authUser = await getUserById(req.session.user.userId);
  try {
      const post = await postData.getPostById(req.params.id);
      res.render('posts/single', {post: post, title: post.title, name: post.username, body: post.info, tags: post.tags, postId: req.params.id, authenticated: authenticatedQ, authUser: authUser});
    } catch (e) {
      res.status(500).json({error: e});
    }
});

//  Get a blogs that contain tags given
router.get('/tag/:tag', async (req, res) => {
  const postList = await postData.getPostsByTag(req.params.tag);
  authenticatedQ = (req.session.user) ? true : false
  res.render('posts/posts', {posts: postList, authenticated: authenticatedQ, tag: true});
  
});

//  Post your blog to the discussion board
router.post('/', async (req, res) => {
  if(req.session.user) {
      //  we need to get the userId param
      // let blogPostData = req.body;
      userId = req.session.user.userId;
      let { title, tags, info } = req.body;
      try {
          validation.checkCreatePost(userId, title, info, tags);
      } catch(e) {
          res.render('posts/newPost', {error: e, authenticated: true});
          return;
      }
      
      try {
          const newPost = await postData.createPost(userId, title, info, tags || []);
          const name = await getUserById(userId);
          // tagArr = newPost.tags.split(",");

          res.render(`posts/single`, {post: newPost, title: title, name: name.username, body: info, tags: newPost.tags, postId: newPost._id, authenticated: true, authUser: name});
      } catch (e) {
          res.status(500).render('posts/newPost', {error: e, authenticated: false});
      }
  }
  else {
      res.render('display/login', {error: "Please log in to post to the discussion board."});
  }
});

// Post your comment to the discussion board
router.post('/comment', async (req, res) => {
  if(req.session.user) {
    userId = req.session.user.userId;
    authUser = await getUserById(userId);
    let { comment, postId } = req.body;
    try{
      validation.checkCreateComment(postId, userId, comment);
    } catch(e){
      //ERROR IF EMPTY
    }
    
    try {
      const newComment = await postData.createComment(postId, userId, comment);
      const post = await postData.getPostById(postId);

      res.render(`posts/single`, {post: post, title: post.title, name: post.username, body: post.info, tags: post.tags, postId: postId, authenticated: true, authUser: authUser});
  } catch (e) {
      const post = await postData.getPostById(postId);
      res.status(500).render('posts/single', {errorComment: e, post: post, title: post.title, name: post.username, body: post.info, tags: post.tags, postId: postId, authenticated: true});
  }
  }
});

//  Delete a post from the user and discussion board
router.delete('/:id', async (req, res) => {
  if(!req.session.user){
    res.status(500).render('error/error', {error: "Must be authenticated to delete a post", authenticated: false});
  }
  try { //post doesn't exist
    let pData = await postData.getPostById(req.params.id);
    if(req.session.user.username != pData.username)
      throw "User isn't authenticated to delete this post";
  } catch (e) {
    res.status(404).render('error/error', {error: e, authenticated: true});
    return;
  }
  try {
    await postData.removePost(req.params.id);
    let posts = await getAllPosts();
    let goBack = true;
    res.status(200).render('posts/discussion', { deletionMsg: "Successfully Deleted Post", authenticated: true, posts: posts, flag: goBack});
  } catch (e) {
    res.status(500).render('error/error', {error: e, authenticated: true});
  }
});

//  Delete a comment from a post
router.delete('/comment/:id', async(req, res) => {
  if(req.session.user) {
    try{
      let userId = req.session.user.userId;
      
      let authUser = await getUserById(userId);
      let commentUser = await postData.getCommentById(req.params.id);
      if(req.session.user.username != commentUser.username)
        throw "User isn't authenticated to delete this post";
      let badpost = await postData.getPostByCommentId(req.params.id);
      await postData.removeComment(req.params.id);
      let post = await postData.getPostById(badpost._id);
      res.status(200).render('posts/single', { deletionMsg: "Successfully Deleted Post", post: post, title: post.title, name: post.username, body: post.info, tags: post.tags, postId: post._id, authenticated: true, authUser: authUser});
    } catch(e){
      res.status(500).render('error/error', {error: e});
    }
  } else {
    res.status(500).render('error/error', {error: "Must be authenticated to delete a comment", authenticated: false});
  }
});

module.exports = router;