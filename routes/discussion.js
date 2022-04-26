const express = require('express');
const router = express.Router();

//show discussion page
router.get('/', async (req, res) => {
    res.render('display/discussion');
    return;
});

module.exports = router;