var express = require('express')
var router = express.Router()
const { ensureAuthenticated } = require('../../config/auth');
const Article = require('../../models/Article');
// const bcrypt = require('bcryptjs');
// const passport = require('passport');


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next()
})

//user dashboard
router.get('/', ensureAuthenticated, (req, res) =>{
    Article.find({}, function (err, articles) {
        // console.log(articles);
        // console.log("articles founds");
        res.render('pages/article/index',{
            articles
        })
    });
});


router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    var id  = req.params.id;
    Article.findByIdAndRemove(id, function (err) {
        if (err) return next(err);
        req.flash(
            'success_msg',
            'Article Deleted successfully'
        );  
        res.redirect('/article');
    })
     
}) 

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    var id = req.params.id;
    Article.findById(id, function (err,article) {
        if (err) return next(err);
        
        res.render('pages/article/add',{
            article
        })
    })

}) 

router.get('/add', ensureAuthenticated, (req, res) =>
    res.render('pages/article/add')
);
router.post('/save', ensureAuthenticated, (req, res) =>{  
    const { title, description, author } = req.body;
    let errors = [];

    if (!title || !description) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('pages/article/index', {
            errors,
            title,
            description,
            author
        });
    } else {

        // Article.create({ title: title, description: description, author: author }, function (err, article) {
        //     if (err) {
        //         return handleError(err);
        //     } else {
        //         req.flash(
        //             'success_msg',
        //             'Article added successfully'
        //         );
        //     }
        //     res.redirect('/article');
        // });

        const newArticle = new Article({
            title,
            description,
            author
        });
        newArticle.save(function (err) {
            if (err){
                return handleError(err);     
            }else{
                req.flash(
                    'success_msg',
                    'Article added successfully'
                );           
            } 
            res.redirect('/article');
        });
        
    }
});


router.post('/update', ensureAuthenticated, (req, res) => {
    const { id,title, description, author } = req.body;
    let errors = [];

    if (!title || !description) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('pages/article/index', {
            errors,
            title,
            description,
            author
        });
    } else {

        Article.findByIdAndUpdate(id, {
            title: title,
            description: description,
            author: author
        } ,function (err, article) {
            if (err) {
                return handleError(err);
            } else {
                req.flash(
                    'success_msg',
                    'Article Updated successfully'
                );
            }
            res.redirect('/article');
        })
    }
});


module.exports = router 