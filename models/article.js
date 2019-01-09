var db = require('../db');
var ArticleSchema = new db.Schema({
    title: String,
    description: String,
    author: String
});

var Article = db.model('Article', ArticleSchema);
 


module.exports = Article; 