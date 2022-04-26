const express = require('express');
const router = express.Router();

//log user out
router.get('/', async (req, res) => {
    req.session.destroy();
    res.render('display/logout', {authenticated: false});
    return;
});

module.exports = router;