const express = require('express');
const router = express.Router({mergeParams: true});

const {reviewSchema} = require('../joiSchemas');
const AppError = require("../utilities/AppError");
const asyncCatcher = require('../utilities/asyncCatcher');

const GymBootcamp = require("../models/gymBootcamp");
const Review = require("../models/review");
const {validateReview, isAuthenticated, isReviewCreator} = require('../middleware/middleware')

  //Create A new review /EJS :Show
router.post(
  "/",
	isAuthenticated,
  validateReview,
  asyncCatcher(async(req, res) => {
	  const{ id } = req.params;     
	  const gymBootcamp = await GymBootcamp.findById(id);
	  const review = new Review(req.body.review);
		review.author = req.user._id;
	  gymBootcamp.reviews.push(review);
	  await gymBootcamp.save();
	  await review.save();
	  req.flash('success', 'New review gym or bootcamp was successfully added!');
	  res.redirect(`/gymBootcamps/${id}`);
})
);


// protect postman route 
router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await GymBootcamp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'New review gym or bootcamp was successfully deleted!');
		res.redirect(`/gymBootcamps/${id}`);
	})
);


module.exports = router
