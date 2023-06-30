const model = require('../models/user');
const Connection = require('../models/connection');
const RSVP = require('../models/RSVP');
const User = require('../models/user');
const { trimEnd } = require('lodash');

exports.getUserLogin = (req,res)=>{
    res.render('../views/user/login')
}

exports.create = (req, res, next)=>{
    
    let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/user/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/back');
        }
        next(err);
    }); 
    
};

exports.new = (req,res)=>{
    res.render('../views/user/new')
}

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
let email = req.body.email;
if(email)
    email = email.toLowerCase();
let password = req.body.password;
model.findOne({ email: email })
.then(user => {
    if (!user) {
        req.flash('error', 'wrong email address');  
        res.redirect('/user/login');
        } else {
        user.comparePassword(password)
        .then(result=>{
            if(result) {
                req.session.user = user.id;
                req.session.loggedin = true;
                req.flash('success', 'You have successfully logged in');
                res.redirect('/user/profile');
        } else {
            req.flash('error', 'wrong password');      
            res.redirect('/user/login');
        }
        });     
    }     
})
.catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), Connection.find({host: id}),RSVP.find({host: id})])
    .then(results=>{
        const [user, connections, RSVP] = results;
        res.render('./user/profile', {user, connections, RSVP});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };

