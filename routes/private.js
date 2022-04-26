const express = require('express');
const router = express.Router();

//show private page
router.get('/', async (req, res) => {
    let username = req.session.user.username;
    res.render('display/account', {username: username});
    return;
});

module.exports = router;