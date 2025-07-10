if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodoverride= require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js')
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

app.listen(8080,(req,res)=>{
    console.log("Listening to Port 8080");
})

// app.get("/",(req,res)=>{
//     res.send("root is working");
// })
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js")

app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);



main().then(res => console.log("Connection Successful")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}





app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)



app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statuscode = 500, message = "Something Went Wrong!"} = err;
    res.status(statuscode).render("./listings/error.ejs",{message});
})
