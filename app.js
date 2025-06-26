const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodoverride= require("method-override");
const ejsMate = require('ejs-mate');

app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extemded:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);

main().then(res => console.log("Connection Successful")).catch(err => console.log(err));

async function main() {
    const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);
}

app.listen(8080,(req,res)=>{
    console.log("Listening to Port 8080");
})

app.get("/",(req,res)=>{
    res.send("root is working");
})

// app.get("/testlisting",async (req,res)=>{
//     let newlisting = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })

//     await newlisting.save();
//     console.log("Saved");
// })


app.get("/listings",async (req,res)=>{                  //INDEX ROUTE
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
});

app.get("/listings/new", (req,res)=>{                  //NEW ROUTE
    res.render("./listings/new.ejs")
})

app.post("/listings",async (req,res)=>{              //CREATE ROUTE
    let {title,description,image,price,location,country} = req.body;
    let newlist = new Listing({
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country
    })
    await newlist.save();
    res.redirect("/listings");
})

app.get("/listings/:id",async (req,res)=>{                //SHOW ROUTE   
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});
 
app.get("/listings/edit/:id",async (req,res)=>{            //EDIT ROUTE
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

app.put("/listings/:id", async (req,res)=>{                //UPDATE ROUTE
    let {id} = req.params;
    let {title,description,image,price,location,country} = req.body;
    await Listing.findByIdAndUpdate(id,{
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country
    });
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})



