const express = require('express');
const router = express.Router();

//show profile page
router.get('/', async (req, res) => {
    if(!req.session.user) {
        res.redirect('/login');
    } else {
        res.render('display/account', {});
    }
});

module.exports = router;