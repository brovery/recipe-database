var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

var recipes = {};

fs.readFile('recipes.json', 'utf8', (err, data) => {
    if (err) throw err;
    recipes = JSON.parse(data);
    console.log(recipes[0]);
});

app.get('/api/getRecipes', (req, res) => {
    res.send(recipes);
});

app.post('/api/addRecipe', (req, res) => {
    var newRecipe = req.body;
    // Will need to add some error-checking to this to confirm that the recipe is set up correctly.

    recipes.push(newRecipe);
    fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
        if (err) res.send("failed");
        else res.send("success");
    })
});


app.listen(3000, function() {
    console.log('App listening on port 3000');
});