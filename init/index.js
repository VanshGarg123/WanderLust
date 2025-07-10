const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(res => console.log("Connection Successful")).catch(err => console.log(err));

async function main() {
    const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '686e59cc0edc5927de6f6251'}));
    await Listing.insertMany(initData.data);
    console.log("Database Initialized");
}

initDB();
