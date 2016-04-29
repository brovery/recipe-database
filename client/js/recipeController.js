(function () {
    'use strict';

    angular.module('recipeController', [])
        .controller('recipeController', recipeController);

    recipeController.$inject = ['recipeService', 'recipe', '$firebaseArray', '$localStorage', '$interval', '$scope'];

    function recipeController(recipeService, recipe, $firebaseArray, $localStorage, $interval, $scope) {
        // list everything
        var rc = this;
        var num = 0;
        rc.recipes = recipeService.recipes;
        rc.recipe = recipe;
        rc.loggedin = recipeService.loggedin;
        rc.addToCookBookButton = recipeService.addToCookBookButton;
        rc.initRecipe = initRecipe;
        rc.addtoCookBook = addtoCookBook;
        rc.editRecipe = editRecipe;
        rc.star = star;
        rc.getRating = getRating;

        console.log(rc.recipe);

        if (rc.recipe == undefined) {
            console.log("hehe");
            rc.recipe = $localStorage.curRecipe;
        }

        // define functions
        function initRecipe() {
            recipeService.initRecipe();
        }

        function addtoCookBook(id) {
            recipeService.addtoCookBook(id);
            $('.add-button').css("display", "none");
        }

        function star(id, n) {
            var url = 'https://geo-recipes.firebaseio.com';
            var fireURL = new Firebase(url + "/Recipes/" + id + '/rating');
            var fireRate = $firebaseArray(fireURL);

            var mongoRate = 'http://localhost:3000/api/rate';

            for (var i = 1; i <= n; i++) {
                var starId = '#' + i + 'star';
                $(starId).html("&#x2605");
                $(starId).css("color", "yellow");
            }

            var user = recipeService.loggedin.user;
            var newRate = {
                user: user,
                rating: n
            };
            fireRate.$loaded(function () {
                for (i = 0; i < fireRate.length; i++) {
                    if (user === fireRate[i].user) {
                        fireRate.$remove(fireRate[i]);
                    }
                }
                fireRate.$add(newRate);
            });
            getRating(id);

        }

        function getRating(key) {
            $interval(function () {
                recipeService.getRating(key);
                rc.rating = recipeService.rateTotal;

            }, 800, 3).then(function () {
                for (var i = 1; i <= 5; i++) {
                    var starId = '#' + i + 'star';
                    $(starId).html('<i class="fa fa-star-o"></i>');
                    $(starId).css("color", "black");
                }
                for (var i = 1; i <= rc.rating.rating; i++) {
                    var starId = '#' + i + 'star';
                    $(starId).html('<i class="fa fa-star"></i>');
                    $(starId).css("color", "blue");
                }
            });


        }

        function editRecipe() {
            recipeService.curRecipe = $localStorage.curRecipe;
        }

    }

}());