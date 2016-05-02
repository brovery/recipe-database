(function () {
    'use strict';

    angular.module('basicApp', [
            "ui.router",
            "navController",
            "homeController",
            "homeService",
            "recipeService",
            "firebase",
            "recipeController",
            "newCtrl",
            "ngFileUpload",
            "loginController",
            "myCookBookController",
            "ngStorage",
            "app.filters",
            "editrecipeController",
            "infinite-scroll"
        ])

        .config(["$stateProvider", "$urlRouterProvider", "$localStorageProvider",
            function ($stateProvider, $urlRouterProvider, $localStorageProvider) {

                // define all app states (pages)
                $stateProvider
                    .state("home", {
                        url: "/home",
                        templateUrl: "templates/home.html",
                        controller: "homeController as hc"
                    })
                    .state("newRecipe", {
                        url: "/newRecipe",
                        templateUrl: "templates/newRecipe.html",
                        controller: "newCtrl as nc"
                    })
                    .state("about", {
                        url: "/about",
                        templateUrl: "templates/about.html"
                    })
                    .state("myCookBook", {
                        url: "/myCookBook",
                        templateUrl: "templates/myCookBook.html",
                        controller: "myCookBookController as mcc"
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: "templates/login.html",
                        controller: "loginController as lc"
                    })
                    .state("editRecipe", {
                        url: "/editRecipe",
                        templateUrl: "templates/editRecipe.html",
                        controller: "editrecipeController as ec"

                    })
                    .state("recipe", {
                        url: "/:id",
                        templateUrl: "templates/recipe.html",
                        controller: "recipeController as rc",
                        resolve: {
                            recipe: function ($stateParams, recipeService, $localStorage) {
                                console.log("recipeService id", recipeService.recipes);
                                // TODO: On reload, recipes.data is undefined (asynch?). Fix it!
                                for (var i = 0; i < recipeService.recipes.data.length; i++) {
                                    if (recipeService.recipes.data[i]._id == $stateParams.id) {
                                        $localStorage.curRecipe = recipeService.recipes.data[i];
                                        return recipeService.recipes.data[i];
                                    }
                                }
                            }
                        }
                    });

                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/home");

                //local storage
                $localStorageProvider.setKeyPrefix('');
            }]);

}());
