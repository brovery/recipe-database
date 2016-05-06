(function () {
    'use strict';

    angular.module('recipeController', [])
        .controller('recipeController', recipeController);

    recipeController.$inject = ['$http', 'recipeService', 'recipe', '$localStorage'];

    function recipeController($http, recipeService, recipe, $localStorage) {
        // list everything
        var rc = this;
        var num = 0;
        rc.recipes = recipeService.recipes;
        rc.recipe = recipe;
        rc.loggedin = recipeService.loggedin;
        rc.cookbook = recipeService.cookbook;
        rc.addToCookBookButton = recipeService.addToCookBookButton;
        rc.initRecipe = initRecipe;
        rc.addtoCookBook = addtoCookBook;
        rc.editRecipe = editRecipe;
        rc.star = star;
        rc.getRating = getRating;
        rc.temp = temp;

        if (rc.recipe == undefined) {
            rc.recipe = $localStorage.curRecipe;
            console.log(rc.recipe);
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

            $http.post('/api/rate', newRate).then(function (data) {
                getRating(id);
            });
            


        }

        function getRating(key) {
            var mongoGetRating = '/api/getRating?rec_id=' + key;
            $http.get(mongoGetRating).then(function (res) {
                for (var i = 1; i <= 5; i++) {
                    var starId = '#' + i + 'star';
                    $(starId).html('<i class="fa fa-star-o"></i>');
                    $(starId).css("color", "black");
                }
                for (var i = 1; i <= res.data.rating; i++) {
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