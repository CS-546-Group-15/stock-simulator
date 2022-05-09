const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const xss = require('xss');

router.get('/', async (req, res) => {
    if(req.session.user) {
        res.redirect('/');
    } else {
        res.render('display/login', {authenticated: false});
    }
});

router.post('/', async (req, res) => {
    // get req.body username and password
    let { username, password } = req.body;

    //clean
    username = xss(username);
    password = xss(password);
    
    //error check username and password
    try {
        validation.checkUsername(username);
        validation.checkPassword(password);
    } catch(e) {
        res.status(400).render('display/login', {error: e, authenticated: false});
        return;
    }

    //ensures case insensitivity
    username = username.toLowerCase();

    try {
        //check user
        const checkedUser = await userData.checkUser(username, password);
        if(checkedUser.authenticated == true) {
            const userId = await userData.getUser(username);
            req.session.user = {
                name: "AuthCookie", 
                secret: "This cookie will bless you with 100 years of luck, DogeCoin to the mooooon...",
                saveUninitialized: true,
                resave: false, 
                username: username,
                userId: userId._id.toString()
            };
            res.redirect('/portfolio');
            return;
        }
    } catch(e) {
        res.status(400).render('display/login', {error: e, authenticated: false});
        return;
    }
});

module.exports = router;