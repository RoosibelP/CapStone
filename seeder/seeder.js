const mongoose = require('mongoose');
const GymBootcamp = require("../models/gymBootcamp")

//Mongoose Connecting to Mongo
mongoose
	.connect('mongodb://localhost:27017/gymBootcampCapstone', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

  const sampleData = [
   
		{
			gymName: "Crunch ", 
			location: "Rancho Cucamonga",
			description: "classes offer, yoga, ",
	  	image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1568&q=80',
			price: "$",
			submittedBy:"6070be91a560e902d597a1c5",
	},
    {
			gymName: "PlanetH ", 
			location: "Upland",
			description: "classes offer, yoga, ",
			price: "$",
			image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1778&q=80',
			submittedBy:"6070be91a560e902d597a1c5",
		},
    {
			gymName: "24Hours ", 
		  location: "Pasadena",
		  description: " pool, yoga, ",
			price: "$",
			image: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1650&q=80',
			submittedBy:"6070be91a560e902d597a1c5",
	},
    {
			gymName: "CrossFit ", 
	  	location: "Pomona",
	  	description: "classes offer, yoga, ",
			price: "$",
			image: 'https://images.unsplash.com/photo-1564282350350-a8355817fd2e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1534&q=80',
			submittedBy:"6070be91a560e902d597a1c5",
	},
  ];
  // We first clear our database and then add in our GymBootcamp sample
const seedDB = async () => {
	await GymBootcamp.deleteMany({});
	const res = await GymBootcamp.insertMany(sampleData)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});