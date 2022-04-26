const dbConnection = require('../config/mongoConnection');
const connection = require('../config/mongoConnection');

const data = require('../data/');
const users = data.users;
const stockOperations = data.stocks;
const posts = data.posts;

//to seed databases type in terminal: 'npm run seed'

async function main() {
    try{
        const db = await connection.connectToDb();
        // await db.dropDatabase();
        console.log("Starting to Seed Database!");

        // let u1 = await users.createUser("Andrewnar", "iLikeCode");
        await stockOperations.buyStock('62685081f7e059987f041ab0', 'TQQQ', 100);


        // let u2 = await users.createUser("anonUser1", "fakePassword1");



        //let failUser1 = await users.createUser("anarvaez12@verizon.net", "AndrewNar", "sameUsernameOhNO!!!");
        //let failUser2 = await users.createUser("anarvaez@stevens.edu", "diffUsernameSameEmail", "imNotCreative");

        
        console.log("Done Seeding!");

        await connection.closeConnection();
       
    } catch(e){
        console.log("ERROR IN SEED:", e);
        return;
    }
}

main();