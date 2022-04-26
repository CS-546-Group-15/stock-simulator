const validation = require("../validation.js");
const environment = require('../environment');
const axios = require('axios').default;


async function getStockBySymbol(symbol) {
  //error check
  validation.checkSymbol(symbol);
  symbol = symbol.toLowerCase();
  symbol = symbol.trim();
  
  //get token from environment
  const token = environment.token;

  const url = `https://cloud.iexapis.com/stable/tops?token=${token}&symbols=${symbol}`;
  const { data } = await axios.get(url);
  return data;

  /*
  EXAMPLE OF WHAT THE DATA RETURNED WILL BE GIVEN symbol = 'aapl'
      [
          {
              "symbol": "AAPL",
              "sector": "electronictechnology",
              "securityType": "cs",
              "bidPrice": 158.71,
              "bidSize": 164,
              "askPrice": 158.73,
              "askSize": 400,
              "lastUpdated": 1650994885662,
              "lastSalePrice": 158.73,
              "lastSaleSize": 100,
              "lastSaleTime": 1650994877371,
              "volume": 999655
          }
      ]
  */
}



// TODO: NEEDS TO BE REWRITTEN
// called when a user wants to buy a stock
async function buyStock(username, password, symbol, shares) {
    // TODO: validate inputs


    let date_time = new Date().toUTCString();

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });

    if (!user) throw `User doesn't exist with username ${username}`;

    //TODO: API CALL
    let price_purchased = 0;
    let total_cost = 1500//price_purchased * shares;

    const stockPurchased = {
        _id: ObjectId(),
        ticker: stock,
        num_shares: shares,
        price_purchased: price_purchased,
        total_cost: total_cost,
        date_time: date_time
    };

    // TODO: combine with following update: update cash
    await userCollection.updateOne(
        {_id: ObjectId(userID)},
        [{ $set: {cash: user.cash - total_cost }}
    ]);

    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userID) },
        {
          $addToSet: {
            user_stocks: stockPurchased,
          },
        }
      );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Could not purchase stock";

    return stock;
}
// called when a user wants to sell a stock
async function sellStock(userID, stock, shares) {
    // TODO: validate inputs
    const userCollection = await users();

    // TODO: needs to be rewritten
}

module.exports = {
    getStockBySymbol,  
    buyStock,
    sellStock,
}