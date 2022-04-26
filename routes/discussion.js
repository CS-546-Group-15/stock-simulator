const express = require('express');
const router = express.Router();

//show discussion page
router.get('/', async (req, res) => {
    if(req.session.user) {
        res.render('display/discussion', {authenticated: true});
    } else {
        res.render('display/discussion', {authenticated: false});
    }
    return;
});

module.exports = router;