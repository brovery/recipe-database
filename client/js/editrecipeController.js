(function(){
    'use strict';

    angular.module('editrecipeController', [])
        .controller('editrecipeController', editrecipeController);

    editrecipeController.$inject = ['recipeService'];

    function editrecipeController(recipeService) {
        // list everything
        var ec = this;
        ec.recipes = recipeService.recipes;
        ec.curRecipe = recipeService.curRecipe;
        ec.editRecipe = editRecipe;



        // define functions
        function editRecipe() {
            delete ec.curRecipe["rating"];
            ec.curRecipe.userName = recipeService.loggedin.username;
            recipeService.recipes.$add(ec.curRecipe).then(function(ref) {
                ec.key = ref.key();
                recipeService.addtoCookBook(ec.key);
            });
        }

    }

}());