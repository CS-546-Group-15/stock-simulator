const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');

router.post('/login', async (req, res) => {
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
    } catch(e) {
        res.status(400).render('display/login', {error: e});
        return;
    }
});

module.exports = router;