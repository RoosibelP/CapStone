if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');

//const GymBootcamp = require("./models/gymBootcamp");
//const Review = require("./models/review");

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require("./utilities/AppError");
const asyncCatcher = require('./utilities/asyncCatcher');
const {gymBootcampSchema, reviewSchema} = require('./joiSchemas');

const GymBootcamp = require("./models/gymBootcamp");

const gymBootcampRoutes = require('./routes/gymBootcamps')

const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/users');

const session =require('express-session');

const flash = require('connect-flash');

const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/user');

const MongoStore = require('connect-mongo');

//'mongodb://localhost:27017/gymBootcampCapstone'

const url = process.env.DB_STRING || 'mongodb://localhost:27017/gymBootcampCapstone';
//Mongoose Connecting to Mongo   process.env.DB_STRING
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		//useFindAndModify:false,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));


// Setting up EJS and its path
app.set("view engine", 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));


// Making public folder available
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

//parsing DATA
app.use(express.urlencoded({extended: true}));

//Method Override
app.use(methodOverride('_method'));


const secret = process.env.SECRET || 'drake'


const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret,
	},
});

//This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});


// -----SESSION----
const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

// calling flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//-----Middleware---
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	//console.log(res.locals.success);
	next();
});
//------Routes------

// home route
app.get('/', (req, res) => {
  res.render('Home');
});


//  gym routes
app.use("/gymBootcamps", gymBootcampRoutes);
//review route
app.use('/gymBootcamps/:id/reviews', reviewRoutes);

app.use('/', authRoutes);


//middleware
app.use('*', (req, res, next) => {
	next(new AppError("Page not found", 404))
});


app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err});
});

// We need to add in another local key for our flash errors

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});


const port = process.env.PORT || 3000

app.listen(port, () =>{
  console.log(`Listening on port ${port}`);
});