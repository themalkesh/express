var db = require('../db');
var UserSchema = new db.Schema({
    username: String,
    password: String
});

const User = db.model('User', UserSchema);

module.exports = User;