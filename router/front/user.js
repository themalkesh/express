var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../../config/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next()
})

//user dashboard
router.get('/', ensureAuthenticated, (req, res) =>
    res.render('pages/dashboard')
);

//signout
router.get('/signout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});

//login
router.get('/login', function (req, res) {
    res.render('pages/login', {
    });
});
//login
router.get('/register', function (req, res) {
    res.render('pages/register', {
    });
});


router.post('/register', (req, res) => {
    
    const { username, password  } = req.body;
    let errors = [];

    if (!username || !password  ) {
        errors.push({ msg: 'Please enter all fields' });
    }

    // if (password != password2) {
    //     errors.push({ msg: 'Passwords do not match' });
    // }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('pages/register', {
            errors,
            
            username,
            password 
             
        });
    } else {
        User.findOne({ username: username }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('pages/register', {
                    errors,
                    
                    username,
                    password 
                });
            } else {
                const newUser = new User({
                    username,
                    password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/user/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

// router.post('/login', function (req, res) {
//     User.findOne({ username: req.body.username, password: req.body.password }, function (err, user) {
//         if (user) {
//             res.redirect('/user');
//         } else {
//             res.redirect('/user/login');
//         }
//         // console.log(err);
//         // console.log(user);
//     });
//     //var myData = new User(req.body);
//     //var userfound = myData.find()
//     // myData.save()
//     //     .then(item => {
//     //         res.send("item saved to database");
//     //     })
//     //     .catch(err => {
//     //         res.status(400).send("unable to save to database");
//     //     });
//     //res.redirect('/dashboard');
//     // res.send("item saved to database");
// }); 

module.exports = router