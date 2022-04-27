const express = require('express');
const router = express.Router();
const data = require('../data/');
const users = data.users;
const { ObjectId } = require("mongodb");

//show discussion page
router.get('/', async (req, res) => {
    if(req.session.user) {
        let user = await users.getUser(req.session.user.username);
        res.render('display/portfolio', {user: user, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

module.exports = router;