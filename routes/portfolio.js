const express = require('express');
const router = express.Router();

//show discussion page
router.get('/', async (req, res) => {
    if(req.session.user) {
        res.render('display/portfolio', {authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

module.exports = router;