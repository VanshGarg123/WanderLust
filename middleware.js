const ExpressError = require('./utils/ExpressError.js')
const {listingSchema,reviewSchema} = require("./schema.js")
const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")

module.exports.IsLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must logged in to access it");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.ValidateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

module.exports.ValidateReviews = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body, { abortEarly: false });
    if(error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}