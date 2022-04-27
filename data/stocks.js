const validation = require("../validation.js");
const environment = require('../environment');
const { ObjectId } = require("mongodb");
const axios = require('axios').default;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;


async function getStockBySymbol(symbol) {
  //error check
  validation.checkSymbol(symbol);
  symbol = symbol.toLowerCase();
  symbol = symbol.trim();
  
  //get token from environment
  const token = environment.token;

  //data provided by IEX Cloud
  //https://iexcloud.io/
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


// called when a user wants to buy a stock
async function buyStock(userId, symbol, shares) { // TODO: STILL NEED TO DEAL WITH BOUNDS i.e. user doesn't have enough money
    // validate inputs
    validation.checkId(userId);
    validation.checkSymbol(symbol);
    validation.checkShares(shares);

    // format inputs
    userId = userId.trim();
    symbol = symbol.trim();

    let date_time = new Date().toUTCString(); // date and time of purchase

    // get purchasing user
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (!user) throw `User doesn't exist with id ${userId}`;

    // get stock from API call
    stockApiData = await getStockBySymbol(symbol);

    // check if symbol could be found
    if(stockApiData.length < 1) throw `Could not find stock with symbol ${symbol}`;
    // api call returns an array, to get desired stock, get first element of that array
    stockData = stockApiData[0];

    // set price purchased to last sale price
    let price_purchased = stockData.lastSalePrice;
    let totalCost = price_purchased * shares; // calculate for total cost

    //checks if user has capital to buy the stock!
    if(totalCost > user.cash)
        throw `Cannot buy ${shares} shares of '${symbol}' worth $${totalCost.toFixed(2)}. You only have $${user.cash.toFixed(2)}`

    // check if user owns the stock being purchased
    owned = user.stocks.filter(stock => stock.symbol === symbol);
    if(owned.length < 1) { // case: user does not own the stock being purchased
        const stockPurchased = { // create stock subdoc
            _id: ObjectId(),
            symbol: symbol,
            num_shares: shares,
            weighted_average_price: price_purchased,
            total_cost: totalCost,
            date_time: date_time // first purchase of stock
        };

        const updateInfo = await userCollection.updateOne( // update user
            { _id: ObjectId(userId) },
            {
                $inc: { cash: -totalCost }, // update cash amount
                $addToSet: { stocks: stockPurchased } // add new stock to stock
            }
        );
        // check for errors updating
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
        throw "Could not purchase stock";
    } else { // user owns the stock being purchased
        stock = owned[0]; // get owned stock info
        avgPrice = ((stock.weighted_average_price * stock.num_shares) + (totalCost)) / (stock.num_shares + shares); // calculate weighted average price from previous average and new price

        const updateInfo = await userCollection.updateOne( // update the owned stock subdocument
            { 
                _id: ObjectId(userId),
                'stocks.symbol': symbol
            },
            {
                $inc: { 
                    cash: -totalCost, // decrement amount of cash
                    'stocks.$.num_shares': shares, // increment number of shares
                    'stocks.$.total_cost': totalCost // increment total cost
                },
                $set: {
                    'stocks.$.weighted_average_price': avgPrice // set average price to recalculated weighted average price
                }
            }
        );
        // check for errors updating
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Could not purchase stock";
    }
    // might change this return type later, for now it's just a confirmation
    return { purchased: true };
}
// called when a user wants to sell a stock
async function sellStock(userId, symbol, shares) { // TODO: STILL NEED TO DEAL WITH BOUNDS i.e. user doesn't have enough shares to sell
    // validate inputs
    validation.checkId(userId);
    validation.checkSymbol(symbol);
    validation.checkShares(shares);

    // format inputs
    userId = userId.trim();
    symbol = symbol.trim();

    let date_time = new Date().toUTCString(); // date and time of purchase

    // get purchasing user
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (!user) throw `User doesn't exist with id ${userId}`;

    // get stock from API call
    stockApiData = await getStockBySymbol(symbol);

    // check if symbol could be found
    if(stockApiData.length < 1) throw `Could not find stock with symbol ${symbol}`;
    // api call returns an array, to get desired stock, get first element of that array
    stockData = stockApiData[0];

    // set price sold to last sale price
    let price_sold = stockData.lastSalePrice;
    let totalCost = price_sold * shares; // calculate for total cost

    // check if user owns the stock being purchased
    owned = user.stocks.filter(stock => stock.symbol === symbol);
    if(owned.length < 1) { // case: user does not own the stock being sold, cannot sell stock
        throw 'user does not own this stock';
    } else { // user owns the stock being purchased
        stock = owned[0]; // get owned stock info

        // check if selling given amount of shares sells all shares
        if(stock.num_shares - shares === 0) { // user wants to sell all shares
            const updateInfo = await userCollection.updateOne( // all shares sold, remove subdoc from stocks
                {
                    _id: ObjectId(userId),
                    'stocks.symbol': symbol
                },
                { $pull: { stocks: { symbol: symbol } } } // remove subdoc
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Could not sell stock";
            return { sold: true }; // confirm sale
        } else if ((stock.num_shares - shares) < 0){
            let plural = (stock.num_shares==1) ? '' : 's';
            let pluralShares = (shares == 1) ? '' : 's';
            throw `Cannot sell ${shares} share${pluralShares} of ${symbol}. You only have ${stock.num_shares} share${plural}!`
        }

        avgPrice = ((stock.weighted_average_price * stock.num_shares) - (totalCost)) / (stock.num_shares - shares); // calculate weighted average price from previous average and new price

        const updateInfo = await userCollection.updateOne( // update the owned stock subdocument
            { 
                _id: ObjectId(userId),
                'stocks.symbol': symbol
            },
            {
                $inc: { 
                    cash: totalCost, // increment amount of cash
                    'stocks.$.num_shares': -shares, // decrement number of shares
                    'stocks.$.total_cost': -totalCost // decrement total cost
                },
                $set: {
                    'stocks.$.weighted_average_price': avgPrice // set average price to recalculated weighted average price
                }
            }
        );
        // check for errors updating
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Could not sell stock";
    }
    // might change this return type later, for now it's just a confirmation
    return { sold: true };
}

module.exports = {
    getStockBySymbol,  
    buyStock,
    sellStock
}