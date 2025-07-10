const User = require("../models/user.js");


module.exports.signupForm = (req,res) =>{
    res.render("user/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});

        await User.register(newUser,password);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("user/login.ejs")
};

module.exports.login = (req,res)=>{
    req.flash("success","Wecome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully");
        res.redirect("/listings");
    })
};