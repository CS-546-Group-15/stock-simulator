const express = require('express');
const router = express.Router();

//show discussion page
router.get('/', async (req, res) => {
    res.render('display/portfolio');
    return;
});

module.exports = router;