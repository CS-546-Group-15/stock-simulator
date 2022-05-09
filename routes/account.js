const express = require('express');
const router = express.Router();
const validation = require('../validation');
const data = require('../data');
const { users } = require('../data');
const userData = data.users;
const postData = data.posts;

//show profile page
router.get('/', async (req, res) => {
    if(req.session.user) {
        res.render('display/account', {username: req.session.user.username, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

//show update page
router.get('/update', async (req, res) => {
    if(req.session.user) {
        res.render('display/update', {username: req.session.user.username, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

//  update the user's username
router.post('/update/username', async (req, res) => {
    //prevents non-authenticated users from attempting to make POST request
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    //get params
    let { current, newUsername, confirmUsername } = req.body;

    //validate each password, displaying errors specific to each (could possibly be abstracted)
    try {
        validation.checkUsername(current);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`Current Username: ${e}`})
    }
    try {
        validation.checkUsername(newUsername);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`New Username: ${e}`})
    }
    try {
        validation.checkUsername(confirmUsername);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`Confirm Username: ${e}`})
    }

    if (newUsername !== confirmUsername) {
        return res.status(400).render('display/update', 
        {username: req.session.user.username, 
        authenticated: true, 
        error:`New Username must match Confirmed Username.`})
    }

    // try {
    //     userData.getUser(newUsername);
    //     return res.status(400).render('display/update', 
    //     {username: req.session.user.username, 
    //     authenticated: true, 
    //     error:`New Username: ${newUsername} is already taken.`})
    // } catch(e) {
    //     console.log(e);
        
    // }

    try {
        //check user
        const checkedUser = await userData.getUser(current);
        if(checkedUser && req.session.user) {
            try {
                await userData.updateUsername(current, newUsername);
                // console.log(current);
                req.session.user.username = newUsername;
                res.status(200).render('display/account', 
                {
                username: req.session.user.username, 
                authenticated: true,
                updated: true,
                updatedField: "username"});
                return;
            } catch (e) {
                res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:e});
            }
        }
    } catch(e) {
        res.status(400).render('display/update', 
            {username: req.session.user.username, 
            authenticated: true, 
            error:`No user found with that username.`});
        return;
    }
});

//  update the users password
router.post('/update/password', async (req, res) => {
    //prevents non-authenticated users from attempting to make POST request
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    //get params
    let { current, newpass, confirmpass } = req.body;

    //validate each password, displaying errors specific to each (could possibly be abstracted)
    try {
        validation.checkPassword(current);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`Current Password: ${e}`})
    }
    try {
        validation.checkPassword(newpass);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`New Password: ${e}`})
    }
    try {
        validation.checkPassword(confirmpass);
    } catch(e) {
        return res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:`Confirm Password: ${e}`})
    }

    if (newpass !== confirmpass) {
        return res.status(400).render('display/update', 
        {username: req.session.user.username, 
        authenticated: true, 
        error:`New password must match confirm password.`})
    }
    
    try {
        //check user
        const checkedUser = await userData.checkUser(req.session.user.username, current);
        if(checkedUser.authenticated == true) {
            try {
                await userData.updatePassword(req.session.user.username, newpass);
                res.status(200).render('display/account', 
                {username: req.session.user.username, 
                authenticated: true,
                updated: true,
                updatedField: "password"});
            } catch (e) {
                res.status(400).render('display/update', 
                {username: req.session.user.username, 
                authenticated: true, 
                error:e});
            }
        }
    } catch(e) {
        res.status(400).render('display/update', 
            {username: req.session.user.username, 
            authenticated: true, 
            error:`Incorrect Password.`});
        return;
    }

    
});

module.exports = router;