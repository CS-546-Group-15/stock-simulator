const connection = require('../config/mongoConnection');

const data = require('../data/');
const users = data.users;
const stockOperations = data.stocks;
const posts = data.posts;

//to seed databases type in terminal: 'npm run seed'

async function main() {
    try{
        const db = await connection.connectToDb();
        await db.dropDatabase(); // UNCOMMENT THIS EVENTUALLY
        console.log("Starting to Seed Database!");

        await users.createUser('elonmusk', 'twitterceo');
        await users.createUser('jeffbezos', 'penislol');
        await users.createUser('billgates', 'nottesla');
        await users.createUser('enreeK', 'password');
        await users.createUser('oatmilk', 'password');
        await users.createUser('oprah', 'password');
        await users.createUser('youheardem', 'password');
        await users.createUser('nancypelosi', 'unbeatable');
        await users.createUser('owner', 'password');

        // and a very special user
        await users.createUser('patrickhill', 'password');

        // get all users to get their ids
        let userList = await users.getAllUsers();

        // elon's holdings
        await stockOperations.buyStock(userList[0]._id.toString(), 'TWTR', 75);
        await stockOperations.buyStock(userList[0]._id.toString(), 'TSLA', 3);
        await posts.createPost(userList[0]._id, "Twitter is all mine!", "I have bought Twitter, I have no regrets...", "shark,twitter,elonmusk");

        // jeff's holdings
        await stockOperations.buyStock(userList[1]._id.toString(), 'AMZN', 3);
        await stockOperations.buyStock(userList[1]._id.toString(), 'UBER', 30);
        await posts.createPost(userList[1]._id, "Elon Musk, more like Elon Tusk!", "Elon may have Twitter now but he's got nothing on me.", "#better,amazon,cmonjeffrey,youcandoit");

        // get all posts as of now
        let postList = await posts.getAllPosts();

        // bill's holdings
        await stockOperations.buyStock(userList[2]._id.toString(), 'MSFT', 25); // notice how he doesn't own any tesla
        await posts.createComment(postList[0]._id, userList[2]._id, "Uh oh, time to never use Twitter again! Selling all my shares.");

        // enreek's holdings
        await stockOperations.buyStock(userList[3]._id.toString(), 'TQQQ', 100);
        await stockOperations.buyStock(userList[3]._id.toString(), 'UPRO', 75);
        await stockOperations.buyStock(userList[3]._id.toString(), 'SPXL', 5);
        await posts.createComment(postList[0]._id, userList[3]._id, "Time to invest, I'm in!");

        // oatmilk's holdings
        await stockOperations.buyStock(userList[4]._id.toString(), 'GM', 150);

        // oprah's holdings
        await stockOperations.buyStock(userList[5]._id.toString(), 'STAG', 100);

        // youheardem's holdings
        await stockOperations.buyStock(userList[6]._id.toString(), 'UDOW', 50);

        // nancy's holdings
        await stockOperations.buyStock(userList[7]._id.toString(), 'GOOG', 2);

        // owner's holdings
        await stockOperations.buyStock(userList[8]._id.toString(), 'FNGU', 300);
        
        console.log("Done Seeding!");
       
    } catch(e){
        console.log("ERROR IN SEED:", e);
    }

    await connection.closeConnection();
    return;
}

main();