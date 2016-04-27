(function(){
    'use strict';

    angular.module('homeController', [])
        .controller('homeController', homeController);

    homeController.$inject = ['recipeService', '$interval'];

    function homeController(recipeService, $interval) {

        // list everything
        var hc = this;
        hc.recipes = recipeService.recipes;
        hc.displayRecipes = hc.recipes//.slice(0,4);
        hc.getMoreRecipes = getMoreRecipes;
        hc.getRating = getRating;

        // define functions
        function getMoreRecipes() {
            hc.displayRecipes = hc.recipes//.slice(0,hc.displayRecipes.length + 4);
        }

        function getRating(key) {
            $interval(function () {
                recipeService.getRating(key);
                hc.rating = recipeService.rateTotal;

            }, 800, 3).then(function () {
                for (var i = 1; i <= 5; i++) {
                    var starId = '#' + i + 'star';
                    $(starId).html('<i class="fa fa-star-o"></i>');
                    $(starId).css("color", "black");
                }
                for (var i = 1; i <= hc.rating.rating; i++) {
                    var starId = '#' + i + 'star';
                    $(starId).html("&#x2605");
                    $(starId).css("color", "blue");
                }
            });


        }



    }

}());
