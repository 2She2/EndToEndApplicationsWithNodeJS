var chatDb = require('./config/chat-db');
chatDb.init('mongodb://localhost:27017/ChatDb');
require('mongoose');

chatDb.registerUser({
    user: 'Pesho',
    pass: 'qwerty'
});

chatDb.registerUser({
    user: 'Gosho',
    pass: 'qwerty'
});

chatDb.sendMessage({
    from: 'Pesho',
    to: 'Gosho',
    text: 'Kak e Goshe?'
});

chatDb.getMessages({from: 'Gosho', to: 'Pesho'}, function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log(result);
});
