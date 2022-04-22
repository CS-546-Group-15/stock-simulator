const dbConnection = require('../config/mongoConnection');
const connection = require('../config/mongoConnection');

const data = require('../data/');
const users = data.users;

//to seed databases type in terminal: 'npm run seed'

async function main() {
    try{
        const db = await connection.connectToDb();
        await db.dropDatabase();
        console.log("Starting to Seed databass!");

        let u1 = await users.createUser("anarvaez@stevens.edu", "Andrewnar", "iLikeCode");
        let u2 = await users.createUser("fake123@gmail.com", "anonUser1", "fakePassword1");

        //let failUser1 = await users.createUser("anarvaez12@verizon.net", "AndrewNar", "sameUsernameOhNO!!!");
        //let failUser2 = await users.createUser("anarvaez@stevens.edu", "diffUsernameSameEmail", "imNotCreative");

        
        console.log("Done Seeding!");

        await connection.closeConnection();
       
    } catch(e){
        console.log("ERROR IN SEED:", e);
    }
}

main();