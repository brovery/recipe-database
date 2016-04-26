var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/recipes';

// The setupDatabase function call will set up a basic database structure with test data. Uncomment it if you want the basic structure set up.
//setupDatabase();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

var recipes, ratings;

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to database");

    var collection = db.collection('recipes');
    var collection2 = db.collection('ratings');

    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        recipes = docs;
        collection2.find({}).toArray(function (err, docs2) {
            assert.equal(err, null);
            ratings = docs2;
            db.close();
        });
    });


});

app.get('/api/getRecipes', (req, res) => {
    var count = 0;
    var sum = 0;
console.log('getting recipes');
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
    console.log(recipes);
    res.send(recipes);
});

app.post('/api/addRecipe', (req, res) => {
    var newRecipe = req.body;
    // Will need to add some error-checking to this to confirm that the recipe is set up correctly.

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('recipes');

        collection.insertOne(newRecipe, function (err, r) {
            assert.equal(err, null);
            console.log("inserted 1 recipe");
            res.send("success");
            db.close();
        });
    });
});

app.post('/api/addBook', (req, res) => {
    var cookbook = req.body;
    // TODO: Need to make sure we're checking the ratings for previous rates & replacing if it's there.

    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);

        var collection = db.collection('recipes');

        collection.insertOne(cookbook, function (err, r) {
            assert.equal(err, null);
            console.log("inserted 1 recipe");
            res.send("success");
            db.close();
        });
    });
});


app.listen(3000, function () {
    console.log('App listening on port 3000');
});

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
            userId: 1,
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