const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utilities/asyncCatcher');
const {gymBootcampSchema} = require('../joiSchemas')
const AppError = require('../utilities/AppError');
const {isAuthenticated, isCreator, validateGymBootcamp } = require('../middleware/middleware')
const GymBootcamp = require('../models/gymBootcamp')


// Route: /playingcards
// Method: GET
// Desc: Render playing card index
// Render: show.ejs
// Permissions: Public
//Models Used
// middleware runs in order

//Name request render/create new file in views all things in our db
// Rendering our index route

router.get(
  "/", 
asyncCatcher(async (req, res) => {
  const gymBootcamps = await GymBootcamp.find({}); 
  res.render('gymBootcamp/index', {gymBootcamps});             
}));


// Route: /playingcards
// Method: GET
// Desc: Render playing card index
// Render: show.ejs
// Permissions: Private
// Creating- render new form for new data

// 

router.get(
  '/new', isAuthenticated, (req, res) => {
	res.render("gymBootcamp/new");
});

// prevents on client side -server
//new route -sending info / EJS 
router.post(
"/", 
isAuthenticated,
validateGymBootcamp,
asyncCatcher(async (req, res) => {
	const gymBootcamp = new GymBootcamp(req.body.gymBootcamps);
	gymBootcamp.submittedBy = req.user._id;
	console.log(req.body)
	await gymBootcamp.save()
	req.flash('success', 'New gym or bootcamp was successfully added!');
	res.redirect(`/gymBootcamps/${gymBootcamp.id}`)
}));


//Not be able to update
//Render the edit form
// check if the are Authenticated and 
router.get(
  "/:id/edit", 
	isAuthenticated,
	isCreator,
asyncCatcher(async (req, res) => {
	const {id} = req.params
	const gymBootcamp = await GymBootcamp.findById(id);
	if (!gymBootcamp) {
		req.flash('error', 'does not exit' );
		res.redirect('/gymBootcamps');
	}
	res.render('gymBootcamp/edit',{ gymBootcamps});
		
})
);

// Show Individual  Details
router.get(
	'/:id',
	asyncCatcher(async (req, res, next) => {
		const { id } = req.params;
		const gymBootcamps = await GymBootcamp.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path:"author",
			}
		})
		.populate('submittedBy');
		if(!gymBootcamps) {
			req.flash('error', ' does not exist!');
			res.redirect("/gymBootcamps")
		}
		res.render('gymBootcamp/show', { gymBootcamps });
	})
);




router.put(
  "/:id", 
	isAuthenticated,
	isCreator,
	validateGymBootcamp,
 asyncCatcher(async (req, res) => {
	const {id} =req.params;
	const resultgymBootcamps = await GymBootcamp.findByIdAndUpdate(id,{
		...req.body.gymBootcamp,
	});
	req.flash('success', 'New gym or bootcamp was successfully updated!');
	res.redirect(`/gymBootcamps/${id}`)
}));


//no delete unless log
// DELETE Data
// authenticate and make sure they are the creators 

router.delete(
  '/:id/delete', 
	isAuthenticated,
	isCreator,
asyncCatcher(async (req,res) => {
	const {id} =req.params
	await GymBootcamp.findByIdAndDelete(id);
	req.flash('success', 'New gym or bootcamp was successfully deleted!');
	res.redirect('/gymBootcamps');
}));


module.exports = router;




