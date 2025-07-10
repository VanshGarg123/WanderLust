const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require('../utils/wrapAsync.js')
const {IsLoggedin,isOwner,ValidateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../CloudConfig.js");
const upload = multer({ storage});



router.route("/")
    .get(wrapAsync(listingController.index))   //INDEX ROUTE
    .post(IsLoggedin,upload.single('listing[image]'),ValidateListing, wrapAsync(listingController.createListing));   //CREATE ROUTE


//NEW ROUTE
router.get("/new", IsLoggedin,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListings))      //SHOW ROUTE
    .put(IsLoggedin,isOwner,upload.single('listing[image]'), ValidateListing,  wrapAsync(listingController.updateListing))     //UPDATE ROUTE
    .delete(IsLoggedin,isOwner,wrapAsync(listingController.destroyListing));     //DELETE ROUTE

//EDIT ROUTE
router.get("/edit/:id",IsLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router; 