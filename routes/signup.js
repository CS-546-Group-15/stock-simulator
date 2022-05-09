const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const xss = require('xss');

//show signup page
router.get('/', async (req, res) => {
    if(req.session.user) {
        res.redirect('/');
    } else {
        res.render('display/signup', {authenticated: false});
    }
});

//attempt sign up
router.post('/', async (req, res) => {
    // get req.body username and password
    let { username, password } = req.body;

    //clean
    username = xss(username);
    password = xss(password);

    //error check
    try {
        validation.checkUsername(username);
        validation.checkPassword(password);
        // validation.checkEmail(email);
    } catch (e) {
        res.status(400).render('display/signup', {error: e, authenticated: false});
        return;
    }

    //ensure case insensitivity
    username = username.toLowerCase();
    try {
        //create user
        // let createdUser = await userData.createUser(email, username, password);
        let result = await userData.createUser(username, password);
        
        if(result.userCreated == true) {
            res.redirect('/login');
            return;
        }
    } catch(e) {
        res.status(400).render('display/signup', {error: e, authenticated: false});
        return;
    }

    res.status(500).render('display/signup', { error: 'Internal Server Error' });
    return;
});

module.exports = router;