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
        rs.recipes = {};// = getRecipes();
        rs.users = $firebaseArray(users);
        rs.rateTotal = {rating: 0};
        rs.addRecipe = addRecipe;
        rs.addtoCookBook = addtoCookBook;
        rs.initRecipe = initRecipe;
        rs.removeRecipe = removeRecipe;
        //rs.getRating = getRating;
        rs.loggedin = {loggedin: false};
        rs.login = login;
        rs.userindex = -1;
        rs.curRecipe = $localStorage['curRecipe'];
        rs.addToCookBookButton = true;
        rs.getRecipes = getRecipes;

        getRecipes();

        // define functions
        function getRecipes() {
            var apiLocation = location + "getRecipes";
            $http.get('/api/getRecipes').catch(function (err) {
                console.log(err);
            }).then(function (response) {
                rs.recipes.data = response.data;
            });
        }

        function addRecipe(recipe) {
            rs.recipes.$add(recipe);
        }

        function initRecipe() {
            //rs.recipes.$add(rs.newRecipes);
        }

        function addtoCookBook(id) {
            console.log(id);
            var add = {
                user_id: rs.loggedin.user,
                rec_id: id
            };

            $http.post('/api/addBook', add).then(function (response) {
                console.log(response.data);
                if (response.data.error) {
                    console.log("Add failed - recipe is already in your cookbook.");
                } else {
                    console.log("Recipe added to cookbook.");
                    rs.cookbook.push(add);
                }
            });
        }

        function removeRecipe(id) {
            console.log(id);

            $http.post('/api/removeBook', { rec_id: id, user_id: rs.loggedin.user }).then((res) => {
                console.log(res);

                for (var i = 0; i < rs.cookbook.length; i++) {
                    if (rs.cookbook[i].rec_id == id) {
                        console.log("removing recipe from local database.");
                        rs.cookbook.splice(i, 1);
                    }
                }
            });
        }

        function login() {

            // make a call to the api to get the cookbook for the current user.
            // console.log(rs.loggedin);
            $http.get('/api/getCookbook?user_id=' + rs.loggedin.user).catch(function (err) {
                console.log(err);
            }).then(function (cookbookData) {
                rs.cookbook = cookbookData.data;

                // Check through the cookbook for the current recipe, and set rs.addtocookbookbutton to false if it's there.
                for (var i = 0; i < rs.cookbook.length; i++) {
                    if (rs.curRecipe._id == rs.cookbook[i].rec_id) {
                        rs.addToCookBookButton = false;
                    }
                }
            });
        }

        // function getRating(key){
        //     var rating = new Firebase(reciperef + '/' + key + '/rating');
        //     var rate = $firebaseArray(rating);
        //     var total = 0;
        //
        //     rate.$loaded(function() {
        //         var len = rate.length - 1;
        //         if (len !== 0) {
        //             for (var i = 0; i < len; i++) {
        //                 total += rate[i].rating;
        //             }
        //             total /= len;
        //         }else{
        //             total = 0;
        //         }
        //     }).then(function(){
        //         rs.rateTotal.rating = total.toPrecision(1);
        //     });
        //
        // }

    }

}());