const dbConnection = require('../config/mongoConnection');
const connection = require('../config/mongoConnection');

const data = require('../data/');
const users = data.users;
const posts = data.posts;

//to seed databases type in terminal: 'npm run seed'

async function main() {
    try{
        const db = await connection.connectToDb();
        await db.dropDatabase();
        console.log("Starting to Seed Database!");

        let u1 = await users.createUser("anarvaez@stevens.edu", "Andrewnar", "iLikeCode");
        let u1Stock1 = await users.addStockToUser(u1._id, "MSFT", 20);
        let u1Stock2 = await users.addStockToUser(u1._id, "AMZN", 45);
        let u1Stock2Rem = await users.sellStockForUser(u1Stock2._id);
        let u1Stock3 = await users.addStockToUser(u1._id, "GME", 500);
        let u2 = await users.createUser("fake123@gmail.com", "anonUser1", "fakePassword1");

        let p1 = await posts.createPost(u1._id, "Is GME a good stock?", "I thinik so because its bullish... let's discuss");
        let p1Updated = await posts.updatePost(p1._id, u1._id, "Is GME a good stock?", "EDIT: I changed my mind Of course it is...");
        let p1Comment1 = await posts.createComment(p1._id, u1._id, "I do like it, but its kind of volitle");
        //let failUser1 = await users.createUser("anarvaez12@verizon.net", "AndrewNar", "sameUsernameOhNO!!!");
        //let failUser2 = await users.createUser("anarvaez@stevens.edu", "diffUsernameSameEmail", "imNotCreative");

        
        console.log("Done Seeding!");

        await connection.closeConnection();
       
    } catch(e){
        console.log("ERROR IN SEED:", e);
    }
}

main();