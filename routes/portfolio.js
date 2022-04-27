const express = require('express');
const router = express.Router();
const data = require('../data/');
const users = data.users;
const stocks = data.stocks;

//show discussion page
router.get('/', async (req, res) => {
    if(req.session.user) {
        let userId = req.session.user.userId;
        let user = await users.getUser(req.session.user.username);
        const userVal = await stocks.getAccVal(userId.toString());
        let userStock = await stocks.getCurrStockPrice(userId.toString());
        res.render('display/portfolio', {stockList: userStock, user: user, userVal: userVal, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

module.exports = router;