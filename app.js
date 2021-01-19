const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const PORT = '3000';

// Passport config
require('./config/passport') (passport);

//DB config
const db = require('./config/keys').mongoURL;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connected error'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
    secret: 'armario verde',
    resave: true,
    saveUninitialized: true,
}));

// Passport midleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// Routers
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));