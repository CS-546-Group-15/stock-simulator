const express = require('express');
const router = express.Router();
const data = require('../data');
const { getUser } = require('../data/users');
const userData = data.users;
const validation = require('../validation');

router.get('/', async (req, res) => {
    if(req.session.user) {
        res.redirect('/');
    } else {
        res.render('display/login', {});
    }
});

router.post('/', async (req, res) => {
    // get req.body username and password
    let { username, password } = req.body;
    
    //error check username and password
    try {
        validation.checkUsername(username);
        validation.checkPassword(password);
    } catch(e) {
        res.status(400).render('display/login', {error: e});
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
            res.redirect('/');
            return;
        }
    } catch(e) {
        res.status(400).render('display/login', {error: e});
        return;
    }
});

module.exports = router;