(function(){
    'use strict';

    angular.module('editrecipeController', [])
        .controller('editrecipeController', editrecipeController);

    editrecipeController.$inject = ['recipeService', '$http', '$location'];

    function editrecipeController(recipeService, $http, $location) {
        // list everything
        var ec = this;
        ec.recipes = recipeService.recipes;
        ec.curRecipe = angular.copy(recipeService.curRecipe);
        ec.editRecipe = editRecipe;



        // define functions
        function editRecipe() {
            delete ec.curRecipe["rating"];
            delete ec.curRecipe["_id"];
            ec.curRecipe.userName = recipeService.loggedin.username;
            
            $http.post('/api/editRecipe', ec.curRecipe).then((res) => {
                recipeService.recipes.data.push(res.data[0]);
                $location.path("/");
            });
        }

    }

}());