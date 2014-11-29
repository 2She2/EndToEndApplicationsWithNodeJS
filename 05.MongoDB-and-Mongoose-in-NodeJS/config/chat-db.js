var mongoose = require('mongoose');
var User = require('../models/User');
var Message = require('../models/Message');

var init = function init(connectionString) {
    mongoose.connect(connectionString);

    var db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log(err);
        }

        console.log('ChatDB up and running!');
    });

    db.on('error', function (err) {
        console.log(err);
    });
};

var registerUser = function register(userData) {
    var newUser = new User({
        user: userData.user,
        pass: userData.pass
    });

    newUser.save(function (err, result) {
        if (err) {
            console.log(err);
        }

        console.log(result);
    });
};

var sendMessage = function sendMessage(message) {
    User.findOne({user: message.from}, function (err, result) {
        if (err) {
            return err;
        }

        var sender = result;

        User.findOne({user: message.to}, function (err, result) {
            if (err) {
                return err;
            }

            var reciever = result;

            var newMessage = new Message({
                from: sender._id,
                to: reciever._id,
                text: message.text
            });

            newMessage.save(function (err, result) {
                if (err) {
                    return err;
                }

                return result;
            });
        });
    });
};

var getMessages = function getMessages(users, callback) {
    var query = User.findOne({user: users.from}, function (err, result) {
        if (err) {
            return err;
        }

        var sender = result;

        User.findOne({user: users.to}, function (err, result) {
            if (err) {
                return err;
            }

            var reciever = result;

            Message.find()
                .where('from').in([sender._id, reciever._id])
                .where('to').in([sender._id, reciever._id])
                .exec(callback);
        });
    });

    return query;
};

module.exports = {
    init: init,
    registerUser: registerUser,
    sendMessage: sendMessage,
    getMessages: getMessages
};