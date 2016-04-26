(function(){
    'use strict';

    angular.module('myCookBookController', [])
        .controller('myCookBookController', myCookBookController);

    myCookBookController.$inject = ['recipeService'];

    function myCookBookController(recipeService) {
        // list everything
        var mcc = this;
        mcc.loggedin = recipeService.loggedin;
        mcc.recipes = recipeService.recipes;
        mcc.cookbook = recipeService.cookbook;
        mcc.removeRecipe = removeRecipe;
        

        // define functions
        function removeRecipe(id) {
            recipeService.removeRecipe(id);
        }


    }

}());