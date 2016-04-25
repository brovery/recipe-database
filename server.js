var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/recipes';



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

var recipes, ratings;

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to database");
    
    var collection = db.collection('recipes');
    
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        recipes = docs;
    });
    
    var collection2 = db.collection('ratings');

    collection2.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        ratings = docs;
        db.close();
    });

});

app.get('/api/getRecipes', (req, res) => {
    var count = 0; 
    var sum = 0;

    for (var i = 0; i < recipes.length; i++) {
        for (var j = 0; j < ratings.length; j++) {
            if (recipes[i]._id == ratings[j].rec_id) {
                count++;
                sum += ratings[j].rating;
            } 
        }
        recipes[i].rating = (sum / count);
        sum = 0;
        count = 0;
    }
    
    res.send(recipes);
});

app.post('/api/addRecipe', (req, res) => {
    var newRecipe = req.body;
    // Will need to add some error-checking to this to confirm that the recipe is set up correctly.

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);

        var collection = db.collection('recipes');

        collection.insertOne(newRecipe, function(err, r) {
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

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);

        var collection = db.collection('recipes');

        collection.insertOne(cookbook, function(err, r) {
            assert.equal(err, null);
            console.log("inserted 1 recipe");
            res.send("success");
            db.close();
        });
    });
});


app.listen(3000, function() {
    console.log('App listening on port 3000');
});