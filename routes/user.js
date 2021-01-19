const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

// User model
const User = require('../models/user');

//login Page
router.get('/login', (req, res) => res.render('Login'));

// Register Page
router.get('/register', (req, res) => res.render('Register'));

// register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2 ) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password match
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' });
    }

    // Check pass leng
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email is alredy register' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password2,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/user/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });        
    }
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/user/login');
})

module.exports = router;