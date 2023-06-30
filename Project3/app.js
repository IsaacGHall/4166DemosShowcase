const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const _ = require('lodash');
const app = express();
const mongoose = require('mongoose');


let port = 8084;
let host = 'localhost';
let url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

//use this link to access webpage http://127.0.0.1:8084/ after activating node server

mongoose.connect(url,
{useNewUrlParser: true, useUnifiedTopology: true,})
.then(()=>{
//start the server
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});

})
.catch(err=>console.log(err.message));

app.use(
    session({
        secret: "qplamzwijsnxeudhcb",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.session = req.session;
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});


app.use('/public',express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render('index');
});


app.use('/connections', connectionRoutes);

//due to about us and contact being in partials I went with this implementation
app.use('/partials', mainRoutes);
//it is probably better in the future if i rename for a real main route and use this as a partialRoute

app.use('/user', userRoutes);



app.use((req, res, next)=>{
    let e = new Error('The server cannot locate ' +req.url);
    e.status = 404;
    next(e);
    
});

app.use((e, req, res, next)=>{
    console.log(e.stack);
    if(!e.status){
        e.status = 500;
        e.message = ("Internal Server Error");

    }

    res.status(e.status);
    res.render('error', {error: e});
});


