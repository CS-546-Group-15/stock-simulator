const express = require("express");
const router = express.Router();
const data = require('../data');
const userData = data.users;
const postData = data.posts;
const eCheck = require("../validation");

router.get('/', async (req, res) => {
  if(req.session.user) res.redirect('/private');
  else res.render('display/login', {});
});

router.get('/signup', async (req, res) => {
  if(req.session.user) res.redirect('/private');
  else res.render('display/signup', {});
});

router.post('/signup', async (req, res) => {
  // get req.body username and password
	let { username, password, email } = req.body;
  if(!username || !password || !email) {
    let error = `Username, Password, or Email not supplied.`;
    res.status(400).render('display/signup', {error: error});
    return;
  }
  try {
    eCheck.checkUsername(username);
    eCheck.checkPassword(password);
    eCheck.checkEmail(email);
  }catch (e) {
    res.status(400).render('display/signup', {error: error});
    return;
  }
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if(!(username.match(letterNumber))) {
    let error = `Username: ${username} must be alphanumeric characters only.`;
    res.status(400).render('display/signup', {error: error});
    return;
  }
  if(password.length != password.trim().length) {
    let error = `Password: ${password} must contain no whitespace.`;
    res.status(400).render('display/signup', {error: error});
    return;
  }
  if(username.trim().length < 4) {
    let error = `Username: ${username} should be at least of length 4.`;
    res.status(400).render('display/signup', {error: error});
    return;
  }
  if(password.trim().length < 6) {
    let error = `Username: ${username} should be at least of length 6.`;
    res.status(400).render('display/signup', {error: error});
    return;
  }
  username = username.toLowerCase();
  try {
    let createdUser = await userData.createUser(email, username, password);
    // console.log(createdUser);
    if(createdUser.userInserted == true) {
      res.redirect('/');
      return;
    }
    }catch(e) {
      res.status(400).render('display/signup', {error: e});
      return;
    }
    res.status(500).render('display/signup', { error: 'Internal Server Error' });
    return;
});

router.post('/login', async (req, res) => {
  // get req.body username and password
	let { username, password } = req.body;
  if(!username || !password) {
    let error = `Username, Password not supplied.`;
    res.status(400).render('display/login', {error: error});
    return;
  }
  try {
    eCheck.checkUsername(username);
    eCheck.checkPassword(password);
    // eCheck.checkEmail(email);
  }catch(e) {
    res.status(400).render('display/login', {error: e});
    return;
  }
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if(!(username.match(letterNumber))) {
    let error = `Username: ${username} must be alphanumeric characters only.`;
    res.status(400).render('display/login', {error: error});
    return;
  }
  if(password.length != password.trim().length) {
    let error = `Password: ${password} must contain no whitespace.`;
    res.status(400).render('display/login', {error: error});
    return;
  }
  if(username.trim().length < 4) {
    let error = `Username: ${username} should be at least of length 4.`;
    res.status(400).render('display/login', {error: error});
    return;
  }
  if(password.trim().length < 6) {
    let error = `Username: ${username} should be at least of length 6.`;
    res.status(400).render('display/login', {error: error});
    return;
  }
  username = username.toLowerCase();
  try {
  const checkedUser = await userData.checkUser(username, password);
  if(checkedUser.authenticated == true) {
      req.session.user = {
        name: "AuthCookie", 
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false, 
        username: username
      };
      res.redirect('/private');
      return;
    }
  }catch(e) {
    res.status(400).render('display/login', {error: e});
    return;
  }
});

router.get('/private', async (req, res) => {
  let username = req.session.user.username;
  res.render('display/account', {username: username});
  return;
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  // res.send('Logged out');
  res.render('display/logout');
  return;
});

module.exports = router;
