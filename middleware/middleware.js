const AppError = require('../utilities/AppError');
const GymBootcamp = require('../models/gymBootcamp');
const Review = require('../models/review')

const {gymBootcampSchema, reviewSchema} = require('../joiSchemas');

// process &continue or redirect to main pg or 
module.exports.isReviewCreator = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/gymBootcamps/${id}`);
	}
	next();
};

// if not authenticated cannot access / go to next
module.exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {    
    req.flash('error', 'You must be signed in to do that');
    return res.redirect('/login');
  }
  next();
};

// process &continue or redirect to main pg or 
module.exports.isCreator = async (req, res, next) => {
	const { id } = req.params;
	const gymBootcamp = await GymBootcamp.findById(id);
	if (!gymBootcamp.submittedBy.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/gymBootcamps/${id}`);
	}
	next();
};


module.exports.validateGymBootcamp =(req, res, next) => {
	const { error} = gymBootcampSchema.validate(req.body);
		if(error) {
			const msg = error.details.map((e) => e.message).join(",")
			throw new AppError(msg, 400)
		} else {
			next()
		};
	};


  module.exports.validateReview =(req, res, next) => {
  const { error} = reviewSchema.validate(req.body);
    if(error) {
      const msg = error.details.map((e) => e.message).join(",")
      throw new AppError(msg, 400)
    } else {
      next()
    };
  };