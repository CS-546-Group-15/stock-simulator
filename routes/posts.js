// Contain all discussion routes. 
const express = require('express');
const router = express.Router();
const validation = require('../validation');
const postData = data.posts;

//  View the discussion board
router.get('/', async (req, res) => {
  const postList = await postData.getAllPosts();
  res.render('posts/index', {posts: postList});
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
    const postList = await postData.getPostsByTag(req.params.tag);
    res.render('posts/index', {posts: postList});
});

//  Post your blog to the discussion board
router.post('/', async (req, res) => {
    let { userID, title, info, tags } = req.body;
    try {
        validation.checkCreatePost(userID, title, info, tags);
    } catch(e) {
        res.render('/', { error: e,});
        return;
    }
  
    try {
      const newPost = await createPost.addPost(userId, title, info, tags);
      res.redirect(`/${newPost._id}`);
    } catch (e) {
      res.status(500).json({error: e});
    }
});

//  Update/modify an existing post
router.put('/:id', async (req, res) => {
    let { userID, title, info, tags } = req.body;
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