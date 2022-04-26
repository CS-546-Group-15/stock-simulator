const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');

router.get('/', async (req, res) => {
    if(req.session.user) {
        res.redirect('/private');
    } else {
        res.render('display/signup', {});
    }
});


router.post('/', async (req, res) => {
    // get req.body username and password
    let { username, password } = req.body;
    console.log(username);
    console.log(password);
    //error check
    try {
        validation.checkUsername(username);
        validation.checkPassword(password);
        // validation.checkEmail(email);
    } catch (e) {
        res.status(400).render('display/signup', {error: e});
        return;
    }
    
    //ensure case insensitivity
    username = username.toLowerCase();
    try {
        //create user
        // let createdUser = await userData.createUser(email, username, password);
        let createdUser = await userData.createUser(username, password);
        
        if(createdUser.userInserted == true) {
            res.redirect('/login');
            return;
        }
    } catch(e) {
        res.status(400).render('display/signup', {error: e});
        return;
    }

    // res.status(500).render('display/signup', { error: 'Internal Server Error' });
    return;
});

module.exports = router;