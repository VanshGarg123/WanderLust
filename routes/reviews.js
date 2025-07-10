const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js')
const Review = require("../models/reviews.js");
const {ValidateReviews,IsLoggedin, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js");

// Post Review Route
router.post("/",IsLoggedin,ValidateReviews, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",IsLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;