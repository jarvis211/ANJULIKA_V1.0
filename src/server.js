'strict';

const http = require('http'),
    ejs = require('ejs'),
    logger = require('morgan'),
    createError = require('http-errors'),
    express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    path = require('path'),
    dotenv = require('dotenv'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    localStratergy = require('passport-local').Strategy,
    facebookOAuth20Stratergy = require('passport-facebook').Strategy,
    googleOAuth20Stratergy = require('passport-google-oauth20');

// Import the external config and JS files into the server.js

const envConfig = require('../config/_env.config');
const dbConnection = require('../config/_db.config');
const User = require('../db/userDataModels/usersRegistrationModel');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', ejs);
app.set('encryptionSecret', envConfig.secret);

dotenv.config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({ secret: envConfig.secret, saveUninitialized: true, resave: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Create Database Connection for the app
mongoose.connect(
    dbConnection.anjulika_users_db_url,
    { useNewUrlParser: true },
    err => {
        if (!err)
            console.log(
                `Connection established to MongoDB :::::::: on PORT ${
                    process.env.MONGODB_PORT
                }`
            );
        else throw err;
    }
);

// Sample code to check the functionality of OAuth
app.get('/', (req, res) => {
    res.end('hello');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

http.createServer(app).listen(process.env.PORT || 8080);

// Unused code snippet for testing purpose

// // Constructor function to create the instance of the registering user
// class CreateUserObject {
//     constructor(email, password, subscribed, provider) {
//         this.email = email;
//         this.password = password;
//         this.subscribed = subscribed;
//         this.provider = provider;
//     }
//     // Add the required methods into the prototype chain of the CreateUserObject
//     create() {
//         // Validate the provider(local, google, facebook ...) and return the JSON object
//         return {
//             local: {
//                 email: this.email,
//                 password: this.password,
//                 subscribed: this.subscribed
//             }
//         };
//     }
// }

// // Setup the route to create the JWT Token and authenticate the user with that
// app.use('/authenticate', (req, res) => {
//     // Search the user in the database and creae the jwt token for it
//     User.findOne({ 'local.email': 'ram' }, (err, user) => {
//         if (err) throw err;

//         if (!user) {
//             res.json({
//                 success: 'false',
//                 message: 'Authentication failed. Wrong password !!!'
//             });
//         } else {
//             // Create the payload for the authentication token
//             const payload = {
//                 'local.email': user.local.email
//             };

//             const token = jwt.sign(payload, app.get('encryptionSecret'), {
//                 expiresIn: '7d'
//             });

//             // Send the JSON response back to the browser
//             res.json({
//                 success: true,
//                 message: 'JWT token created successfully',
//                 token: token
//             });
//         }
//     });
// });

// // Route to create the user and save it to the database
// app.get('/setup', (req, res) => {
//     // Create the user object to store into the database
//     let user = new User(
//         new CreateUserObject('shyam', 'password', true).create()
//     );

//     // Save the user details into the Mongo database and handle the error if any
//     user.save(err => {
//         // Log the error if the users details was unable to save
//         if (err) console.log('Unable to save the user into the database');
//         else {
//             console.log('User details saved successfully into the database');
//             res.json({ success: true });
//         }
//     });
// });
