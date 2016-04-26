(function(){
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location", "recipeService", "$timeout"];

    function navController($location, recipeService, $timeout)
    {
        var nav = this;
        nav.isActive = isActive;
        nav.search = search;
        nav.recipes = recipeService.recipes;
        nav.loggedin = recipeService.loggedin;
        nav.showSearch = false;
        nav.blurit = blurit;


        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        function search() {
            if (!nav.searchText) {
                console.log("No search text!");
            } else {
                console.log("Searching " + nav.searchText);
                
            }
        }

        function blurit() {
            $timeout(function() {
                nav.showSearch=false;
            }, 500);
        }

    }

}());
