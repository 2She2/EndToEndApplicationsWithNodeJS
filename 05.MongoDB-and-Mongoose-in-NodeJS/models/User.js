var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user: {type: String, require: true},
    pass: {type: String, min: 3, required: true}
});

var User = mongoose.model('User', userSchema);

module.exports = User;
