const express = require('express');
const router = express.Router();
const validation = require('../validation');
const data = require('../data');
const userData = data.users;
const xss = require('xss');

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

router.post('/update', async (req, res) => {
    //prevents non-authenticated users from attempting to make POST request
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    //get params
    let { current, newpass, confirmpass } = req.body;

    //clean
    current = xss(current);
    newpass = xss(newpass);
    confirmpass = xss(confirmpass);

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
                await userData.updateUser(req.session.user.username, newpass);
                res.status(200).render('display/account', 
                {username: req.session.user.username, 
                authenticated: true,
                updated: true});
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