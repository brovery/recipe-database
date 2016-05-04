(function() {
    "use strict";

    angular
        .module('app.filters')
        .filter('cookbook', cookbook)
        .filter('times', times);

    cookbook.$inject = ['recipeService', '$interval'];

    function cookbook(recipeService, $interval) {
        return function(input) {
            var newrecipes = [];
            if (input != undefined && recipeService.cookbook != undefined) {
                for (var i = 0; i < input.length; i++) {
                    for (var j = 0; j < recipeService.cookbook.length; j++) {
                        if (input[i]._id == recipeService.cookbook[j].rec_id) {
                            newrecipes.push(input[i]);
                        }
                    }
                }
            }
            return newrecipes;
        };
    }

    function times() {
        return function(input) {
            if (typeof input !== "number") {
                return "N/A";
            }

            if (input >= 60) {
                return Math.floor(input/60) + " hrs, " + input % 60 + " minutes";
            } else {
                return input + " minutes";
            }
        };
    }

})();

