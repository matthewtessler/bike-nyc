var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

// * station or bike rack location
var Location = new mongoose.Schema({
    locationType: {type: String, required: true, enum: ['citibike', 'cityrack']},
    locationName: {type: String, required: true},
    stationID: {type: Number}
});

// user information, including authentication information, += pass-loc-mong
var UserSchema = new mongoose.Schema({
    name: {type: String},
    borough: {type: String, required: false, enum: ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island', 'Commuter']},
    citibiker: {type: Boolean, default: false},
    cityracker: {type: Boolean, default: false},
    locations: [Location]
});

UserSchema.plugin(passportLocalMongoose);
mongoose.model('Location', Location);
mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGODB_URI); 
