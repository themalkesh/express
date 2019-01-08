const express = require('express')
var ejs = require('ejs')
var path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express()
 
require('./config/passport')(passport);



//set template engine
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
 


//set body-parser to get input values from post to object
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use static folder for css and html
app.use(express.static('public'));


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());


// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


var admin = require('./router/admin');
app.use('/admin', admin)
var front = require('./router/front');
app.use('/', front)


// //Home page

// //dashboard
// app.get('/dashboard', function (req, res) {
//     res.render('pages/dashboard', {
//     });
// });


//configur port
var port = process.env.PORT || 3000; 
//start server 
app.listen(port);
console.log('server started on port %s', port);