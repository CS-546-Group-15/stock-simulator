const express = require('express');
const router = express.Router();
const validation = require('../validation');
const data = require('../data');
const postData = data.posts;

//show discussion page
router.get('/', async (req, res) => {
  if(req.session.user) {
        res.render('posts/discussion', {authenticated: true});
    } else {
        res.render('posts/discussion', {authenticated: false});
    }
    return;
});

//show discussion page
router.get('/newPost', async (req, res) => {
    if(req.session.user) {
        res.render('posts/newPost', {});
    } else {
        res.render('display/login', {error: 'Please log in to make a new post.'});
    }
    return;
  });
  
  //  Get a specific blog post by id
  router.get('/:id', async (req, res) => {
    try {
        const post = await postData.getPostById(req.params.id);
        res.render('posts/single', {post: post});
      } catch (e) {
        res.status(500).json({error: e});
      }
  });
  
  //  Get a blogs that contain tags given
  router.get('/tag/:tag', async (req, res) => {
    console.log("tag");
    const postList = await postData.getPostsByTag(req.params.tag);
      res.render('posts/posts', {posts: postList});
  });
  
  //  Post your blog to the discussion board
  router.post('/', async (req, res) => {
    if(req.session.user) {
        //  we need to get the userId param
        // let blogPostData = req.body;
        userId = req.session.user.userId;
        //   console.log(userId);
        let { title, tags, info } = req.body;
        // console.log(title);
        // console.log(tags);
        // console.log(info);
        try {
            validation.checkCreatePost(userId, title, info, tags);
        } catch(e) {
            res.render('posts/newPost', { error: e,});
            return;
        }
        
        try {
            const newPost = await postData.createPost(userId, title, info, tags || []);
            res.redirect(`/${newPost._id}`);
        } catch (e) {
            res.status(500).render('posts/newPost', {error: e});
        }
    }
    else {
        res.render('display/login', {error: "Please log in to post to the discussion board."});
    }
  });
  
  //  Update/modify an existing post
  router.put('/:id', async (req, res) => {
    let { userId, title, info, tags } = req.body;
      try {
        await postData.getPostById(req.params.id);
      } catch (e) {
        res.status(404).render('display/error', {error: e});
        return;
      }
      try {
        const updatedPost = await postData.updatePost(req.params.id, updatedData);
        res.json(updatedPost);
      } catch (e) {
        res.status(500).json({error: e});
      }
  });
  
  //  Delete a post from the user and discussion board
  router.delete('/:id', async (req, res) => {
    try {
      await postData.getPostById(req.params.id);
    } catch (e) {
      res.status(404).render('error/error', {error: e});
      return;
    }
    try {
      await postData.removePost(req.params.id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).render('error/error', {error: e});
    }
  });

module.exports = router;