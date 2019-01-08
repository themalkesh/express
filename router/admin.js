var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/dashboard', function (req, res) {
    res.send('Admin dashboard Page')
})
// define the about route
router.get('/', function (req, res) {
    res.send('Admin Page')
})

module.exports = router