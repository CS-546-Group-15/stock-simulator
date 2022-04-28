const express = require("express");
const router = express.Router();
const data = require("../data/");
const users = data.users;
const stocks = data.stocks;
const validation = require('../validation');

//show discussion page
router.get("/", async (req, res) => {
  if (req.session.user) {
    let userId = req.session.user.userId;
    let user = await users.getUserById(userId);
    let userVal = await stocks.getAccVal(userId);
    let userStocks = await stocks.buildPortfolioTable(userId);
    res.render("display/portfolio", {
      stockList: userStocks,
      user: user,
      userVal: userVal,
      authenticated: true,
    });
  } else {
    res.redirect("/login");
  }
  return;
});

router.post("/buy", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  // user is logged in

  try {
    let { symbol, num_shares } = req.body;
    let userId = req.session.user.userId;
    num_shares = parseInt(num_shares);

    validation.checkShares(num_shares);
    validation.checkSymbol(symbol);

    await stocks.buyStock(userId, symbol, num_shares);
    res.redirect("/portfolio");

  } catch (e) {
    let userId = req.session.user.userId;
    let user = await users.getUserById(userId);
    let userVal = await stocks.getAccVal(userId);
    let userStocks = await stocks.buildPortfolioTable(userId);
    res.status(400).render("display/portfolio", {
        buyError: e,
        stockList: userStocks,
        user: user,
        userVal: userVal,
        authenticated: true,
      });
  }
  
});

router.post("/sell", async (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
      return;
    }
    // user is logged in
  
    try {
      let { symbol, num_shares } = req.body;
      let userId = req.session.user.userId;
      num_shares = parseInt(num_shares);
  
      validation.checkShares(num_shares);
      validation.checkSymbol(symbol);
  
      await stocks.sellStock(userId, symbol, num_shares);
      res.redirect("/portfolio");
  
    } catch (e) {
      let userId = req.session.user.userId;
      let user = await users.getUserById(userId);
      let userVal = await stocks.getAccVal(userId);
      let userStocks = await stocks.buildPortfolioTable(userId);
      res.status(400).render("display/portfolio", {
          sellError: e,
          stockList: userStocks,
          user: user,
          userVal: userVal,
          authenticated: true,
        });
    }
});  

module.exports = router;
