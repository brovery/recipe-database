var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

var url = 'mongodb://localhost:27017/recipes';

// The setupDatabase function call will set up a basic database structure with test data. Uncomment it if you want the basic structure set up.
// setupDatabase();
// setupUser();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSession({secret: 'awesomeness', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

passport.serializeUser(function (user, done) {
    console.log("serialize");
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("deserialize", obj);
    done(null, obj);
});

var recipes, ratings, cookbook, users;

updateData();

function updateData() {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to database");

        var collection = db.collection('recipes');
        var collection2 = db.collection('ratings');
        var collection3 = db.collection('cookbook');
        var collection4 = db.collection('users');

        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            recipes = docs;
            collection2.find({}).toArray(function (err, docs2) {
                assert.equal(err, null);
                ratings = docs2;
                collection3.find({}).toArray(function (err, docs3) {
                    assert.equal(err, null);
                    cookbook = docs3;
                    collection4.find({}).toArray(function (err, docs4) {
                        assert.equal(err, null);
                        users = docs4;
                        db.close();
                    });
                });
            });
        });
    });
}

app.get('/api/getRecipes', (req, res) => {
    var count = 0;
    var sum = 0;

    // console.log('getting recipes');
    for (var i = 0; i < recipes.length; i++) {
        for (var j = 0; j < ratings.length; j++) {
            if (JSON.stringify(recipes[i]._id) == JSON.stringify(ratings[j].rec_id)) {
                count++;
                sum += ratings[j].rating;
            }
        }
        recipes[i].rating = (sum / count);
        sum = 0;
        count = 0;
    }
    console.log("Sending recipes");
    res.send(recipes);
});

app.get('/api/getCookbook', (req, res) => {
    var user_id = req.query.user_id;
    var myCookbook = [];

    for (var i = 0; i < cookbook.length; i++) {
        if (cookbook[i].user_id == user_id) {
            myCookbook.push(cookbook[i]);
        }
    }

    res.send(myCookbook);
});

app.post('/api/addRecipe', (req, res) => {
    var newRecipe = req.body;
    // Will need to add some error-checking to this to confirm that the recipe is set up correctly.

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('recipes');

        collection.insertOne(newRecipe, function (err, r) {
            assert.equal(err, null);
            res.send(r.ops);
            db.close();
        });
    });
    updateData();
});

app.post('/api/rate', (req, res) => {
    var newRating = req.body;

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('ratings');
        collection.updateOne(
            {user_id: newRating.user_id, rec_id: newRating.rec_id},
            newRating,
            {upsert: true}, // This value will insert a new record if no matching record is found.
            function (err, r) {
                assert.equal(err, null);
                res.send(r);
                db.close();
            });
    });
    updateData();
});

app.post('/api/addBook', (req, res) => {
    var cookbook = req.body;

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('cookbook');

        collection.insertOne(cookbook, function (err, r) {
            assert.equal(err, null);
            res.send("success");
            db.close();
        });
    });
    updateData();
});

app.post('/api/removeBook', (req, res) => {
    var cookbook = req.body;

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('cookbook');

        collection.deleteOne({_id: cookbook._id}, function (err, r) {
            assert.equal(err, null);
            console.log("Deleted 1 recipe from cookbook");
            res.send("success");
            db.close();
        });
    });
    updateData();
});

app.post('/api/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        // TODO: Should add error handling here.
        res.send(user);
    })(req, res, next);
});

app.get('/api/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        console.log("callback");
        res.redirect('/');
    }
);

app.get('api/getUser', function (req, res) {
    res.send(req.user);
});

app.get('/api/facebook', passport.authenticate('facebook'), function (req, res) {
    console.log("/api/facebook", res);
});

app.get('/auth/facebook/callback', passport.authenticate('facebook'),
    function (req, res) {
        console.log("Inside callback");
        res.redirect('/#/home');
    }
);


app.listen(3000, function () {
    console.log('App listening on port 3000');
});

// Localstrategy passport auth
passport.use(new LocalStrategy(function (username, password, done) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            console.log("found username");
            if (users[i].password === password) {
                console.log("password matches");
                return done(null, users[i]);
            } else {
                console.log("incorrect password");
                return done(null, false, {message: 'Incorrect password.'});
            }
        }
    }
    return done(null, false, {message: 'Incorrect username.'});
}));

// Google passport auth
passport.use(new GoogleStrategy({
        clientID: "539529748048-ue2jododsf3d4m6gtticj6k5lbapfho0.apps.googleusercontent.com",
        clientSecret: "BFSm5Hr0SMnfRP0z7Mzrv5b0",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("google auth");
        done(null, profile);
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
    }
));

// Facebook passport auth
passport.use(new FacebookStrategy({
        clientID: '1735249653362566',
        clientSecret: '3310f86a10551cf5aa8425b982a9da3d',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log("inside FacebookStrategy");
        cb(null, profile);
    }
));

// This function will create a basic database structure for testing purposes.
function setupDatabase() {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var newRecipe = {
            category: "Appetizer",
            cookTime: 215,
            image: "img/Lets-get-cooking.png",
            ingredients: [
                {ingredient: "Ha", qty: "1"}
            ],
            instructions: [
                {instruction: "asdf"}
            ],
            name: "long cooktime",
            prepTime: 175,
            private: false,
            userName: "Brandon O'Very"
        };

        var newRating = {
            user_id: 1,
            rec_id: "1",
            rating: 5
        };

        var collection = db.collection('recipes');

        collection.insertOne(newRecipe, function (err, docs) {
            assert.equal(err, null);
            recipes = docs;
            newRating.rec_id = docs.ops[0]._id;

            var collection2 = db.collection('ratings');

            collection2.insertOne(newRating, function (err, docs) {
                assert.equal(err, null);
                db.close();
            });
        });
    });
}

// set up basic user in database.

function setupUser() {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        var newUser = {
            username: 'a@a.a',
            password: 'a',
            displayName: 'a',
            emails: [{value: 'a@a.a'}]
        };

        var collection = db.collection('users');

        collection.insertOne(newUser, function (err, docs) {
            assert.equal(err, null);
        });
    });
}