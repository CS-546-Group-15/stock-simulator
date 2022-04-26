const express = require('express');
const router = express.Router();

//show profile page
router.get('/', async (req, res) => {
    if(req.session.user) {
        res.render('display/account', {username: req.session.user.username, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

module.exports = router;