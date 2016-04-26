(function () {
    'use strict';

    angular.module('recipeService', [])
        .service('recipeService', recipeService);

    recipeService.$inject = ['$firebaseArray', '$interval', "$localStorage", "$http"];

    function recipeService($firebaseArray, $interval, $localStorage, $http) {
        var url = 'https://geo-recipes.firebaseio.com';
        var reciperef = new Firebase(url + "/Recipes");
        var users = new Firebase(url + "/Users");
        var location = 'http://localhost:3000/api/';

        // list everything
        var rs = this;
        rs.recipes = getRecipes();
        rs.users = $firebaseArray(users);
        rs.rateTotal = {rating: 0};
        rs.addRecipe = addRecipe;
        rs.addtoCookBook = addtoCookBook;
        rs.initRecipe = initRecipe;
        rs.removeRecipe = removeRecipe;
        rs.getRating = getRating;
        rs.loggedin = {loggedin: false};
        rs.login = login;
        rs.userindex = -1;
        rs.curRecipe = $localStorage['curRecipe'];
        rs.addToCookBookButton = true;
        var key = "";

        // define functions
        function getRecipes() { location += "getRecipes";
           console.log('hi');
            $http.get(location).catch(function(err){
                console.log(err);
            })
                .then(function(response) {
                    console.log(response);
                   return response;
                });
        }

        function addRecipe(recipe) {
            rs.recipes.$add(recipe);
        }

        function initRecipe() {
            //rs.recipes.$add(rs.newRecipes);
        }

        function addtoCookBook(id) {
            // Add the user to the recipe.
            //for (var i = 0; i<rs.recipes.length; i++) {
            //    if (rs.recipes[i].$id == id) {
            //        var user = rs.loggedin.user;
            //        rs.recipes[i].users[user] = true;
            //        rs.recipes.$save(i);
            //    }
            //}

            // Add the recipe to the user.
            var alreadyadded = false;
            for (var i = 0; i < rs.cookbook.length; i++) {
                if (id == rs.cookbook[i].recipe) {
                    alreadyadded = true;
                    console.log("Already Added!");
                }
            }
            if (!alreadyadded) {
                rs.cookbook.$add({recipe: id});
                rs.addToCookBookButton = false;
                console.log("Added Recipe to your cookbook!");
            }
        }

        function removeRecipe(id) {
            for (var i = 0; i < rs.cookbook.length; i++) {
                if (rs.cookbook[i].recipe == id) {
                    rs.cookbook.$remove(rs.cookbook[i]).catch(function(error) {
                        console.log(error);
                    });
                }
            }
        }

        function login() {
            var priorlogin = false, count = 0;

            $interval(function() {
                if (rs.users.length == 0) {
                    count++;
                } else {
                    for (var i = 0; i < rs.users.length; i++) {
                        if (rs.users[i].user == rs.loggedin.user) {
                            priorlogin = true;
                            rs.userindex = i;
                            key = rs.users[i].$id;
                        }
                    }

                    if (!priorlogin) {
                        rs.users.$add({user: rs.loggedin.user}).then(function(ref) {
                            key = ref.key();
                            firebook();
                        });
                        rs.userindex = rs.users.length;
                    } else {
                        firebook();
                    }
                }
            }, 1000, 3);

            if (count == 3) {
                alert("Unable to connect to database. Please try again later.");
            }
        }

        function firebook() {
            // Create link to the user's cookbook.
            var cookbookurl = users + "/" + key + "/recipes";
            var mycookbook = new Firebase(cookbookurl);
            rs.cookbook = $firebaseArray(mycookbook);
            checkCookBook();
        }

        function checkCookBook() {
            var count = 0;
            //console.log(rs.curRecipe.$id);
            $interval(function() {
                if (rs.cookbook.length != 0) {
                    for (var i = 0; i < rs.cookbook.length; i++) {
                        if (rs.cookbook[i].recipe == rs.curRecipe.$id) {
                            rs.addToCookBookButton = false;
                        }
                    }
                }
            }, 1000, 3);
        }

        function getRating(key){
            var rating = new Firebase(reciperef + '/' + key + '/rating');
            var rate = $firebaseArray(rating);
            var total = 0;

            rate.$loaded(function() {
                var len = rate.length - 1;
                if (len !== 0) {
                    for (var i = 0; i < len; i++) {
                        total += rate[i].rating;
                    }
                    total /= len;
                }else{
                    total = 0;
                }
            }).then(function(){
                rs.rateTotal.rating = total.toPrecision(1);
            });

        }

    }

}());