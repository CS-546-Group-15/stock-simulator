const express = require('express');
const router = express.Router();
const data = require('../data/');
const users = data.users;
const stocks = data.stocks;

//show discussion page
router.get('/', async (req, res) => {
    if(req.session.user) {
        let userId = req.session.user.userId;
        let user = await users.getUserById(userId);
        let userVal = await stocks.getAccVal(userId);
        let userStocks = await stocks.buildPortfolioTable(userId);
        res.render('display/portfolio', {stockList: userStocks, user: user, userVal: userVal, authenticated: true});
    } else {
        res.redirect('/login');
    }
    return;
});

module.exports = router;