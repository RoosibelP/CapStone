const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const GymBootcampSchema = new Schema({
  gymName: String,
  price: String,
  image: String,
  description: String,
  location: String,
  submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
  reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

});


GymBootcampSchema.post('findOneAndDelete', async function (data) {
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});



module.exports = mongoose.model("GymBootcamp", GymBootcampSchema);