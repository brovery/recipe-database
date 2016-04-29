(function () {
    'use strict';

    angular.module('newCtrl', [])
        .controller('newCtrl', newCtrl);

    newCtrl.$inject = ['Upload', 'recipeService', '$http'];

    function newCtrl(Upload, recipeService, $http) {

        var location = 'http://localhost:3000/api/addRecipe';

        // list everything
        var nc = this;
        nc.recipes = recipeService.recipes;
        var Recipe = function () {
            this.name = "";
            this.prepTime = "";
            this.cookTime = "";
            this.ingredients = [];
            this.instructions = [];
            this.category = '';
        };
        var defaultImage = 'img/Lets-get-cooking.png';
        nc.imageShow = defaultImage;
        nc.name = '';
        nc.ingredients = [];
        nc.instructions = [];
        nc.prepTime = "";
        nc.cookTime = "";
        nc.category = "";
        nc.wrongFile = "";
        nc.privacy = false;
        nc.userName = recipeService.loggedin.username;
        nc.editHide = true;
        nc.createRecipe = createRecipe;
        nc.imageChange = imageChange;
        nc.removeIng = removeIng;
        nc.removeIns = removeIns;
        nc.addPost = addPost;
        nc.editName = editName;

        function createRecipe() {
            
            var newRecipe = new Recipe();
            newRecipe.name = nc.name;
            if (nc.imageShow === defaultImage) {
                newRecipe.image = defaultImage;
            } else {
                newRecipe.image = nc.files;
            }
            newRecipe.prepTime = nc.prepTime;
            newRecipe.cookTime = nc.cookTime;
            newRecipe.category = nc.category;
            newRecipe.private = nc.privacy;
            newRecipe.userName = nc.userName;
            newRecipe.rating = {placeholder: 0};
            for (var i = 0; i < nc.ingredients.length; i++) {
                newRecipe.ingredients.push({ingredient: nc.ingredients[i].name, qty: nc.ingredients[i].qty});
            }
            for (i = 0; i < nc.instructions.length; i++) {
                newRecipe.instructions.push({instruction: nc.instructions[i].name});
            }

            addRecipe(newRecipe);

            nc.name = '';
            nc.ingredients = [];
            nc.instructions = [];
            nc.prepTime = "";
            nc.cookTime = "";
            nc.category = "";
            nc.imageShow = 'img/Lets-get-cooking.png';
        }

        function addRecipe(recipe) {
            $http.post(location, recipe).then(function(ref){
                //var recipesId = ref.key();
                //recipeService.addtoCookBook(recipesId);
            });
        }

        function addPost(files) {
            Upload.base64DataUrl(files).then(function (base64Urls) {
                nc.files = base64Urls;
            });
            nc.imageShow = files;
            console.log(nc.imageShow);
        }

        function imageChange(file, rejFiles) {
            if (rejFiles) {
                nc.wrongFile = "Incorrect file type";
            } else {
                nc.wrongFile = "";
            }
            if (file === null) {
                nc.wrongFile = "Incorrect file size: 2MB or less";
            } else {
                nc.wrongFile = "";
            }
        }

        function removeIng(n) {
            console.log(recipeService.loggedin);
            nc.ingredients.splice(n, 1);
        }

        function removeIns(n) {
            nc.instructions.splice(n, 1);
        }

        function editName(){
            nc.editHide = false;
        }

    }
}());
