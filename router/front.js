var express = require('express')
var router = express.Router()



// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


router.get('/', function (req, res) {
    var tagline = 'this is my tagline';
    res.render('pages/index', {
        tagline: tagline
    });
});


var user = require('./front/user');
router.use('/user', user)


module.exports = router