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
        await db.dropDatabase();
        console.log("Starting to Seed Database!");

        await users.createUser("Andrewnar", "iLikeCode");
        await users.createUser("ryanClark", "mytopsecretpassword");
        await users.createUser("stinkyOOops", "imsorryforthis");
        let userList = await users.getAllUsers();
        await stockOperations.buyStock(userList[0]._id.toString(), 'TQQQ', 100);
        await stockOperations.buyStock(userList[1]._id.toString(), 'GME', 2);
        await stockOperations.buyStock(userList[2]._id.toString(), 'SCHB', 4);


        // let u2 = await users.createUser("anonUser1", "fakePassword1");


        // let u2 = await users.createUser("anonUser1", "fakePassword1");



        //let failUser1 = await users.createUser("anarvaez12@verizon.net", "AndrewNar", "sameUsernameOhNO!!!");
        //let failUser2 = await users.createUser("anarvaez@stevens.edu", "diffUsernameSameEmail", "imNotCreative");

        //in the name of test
        
        console.log("Done Seeding!");
       
    } catch(e){
        console.log("ERROR IN SEED:", e);
    }

    await connection.closeConnection();
    return;
}

main();