(function () {
    'use strict';

    angular.module('recipeController', [])
        .controller('recipeController', recipeController);

    recipeController.$inject = ['$http', 'recipeService', 'recipe', '$firebaseArray', '$localStorage', '$interval', '$scope'];

    function recipeController($http, recipeService, recipe, $firebaseArray, $localStorage, $interval, $scope) {
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
        rc.temp = temp;

        console.log(rc.recipe);

        if (rc.recipe == undefined) {
            console.log("hehe");
            rc.recipe = $localStorage.curRecipe;
        }

        // define functions
        function temp() {
            console.log(rc.loggedin.loggedin);
            console.log(rc.addToCookBookButton);
        }
        
        function initRecipe() {
            recipeService.initRecipe();
        }

        function addtoCookBook(id) {
            recipeService.addtoCookBook(id);
            $('.add-button').css("display", "none");
        }

        function star(id, n) {
            var mongoRate = 'http://localhost:3000/api/rate';

            for (var i = 1; i <= n; i++) {
                var starId = '#' + i + 'star';
                $(starId).html("&#x2605");
                $(starId).css("color", "yellow");
            }

            var newRate = {
                user_id: recipeService.loggedin.user,
                rating: n,
                rec_id: id
            };

            console.log(newRate);

            $http.post(mongoRate, newRate).then(function (data) {
                console.log(data);
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