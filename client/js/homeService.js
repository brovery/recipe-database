(function(){
    'use strict';

    angular.module('homeService', [])
        .service('homeService', homeService);

    homeService.$inject = [];

    function homeService() {

        // list everything
        var hs = this;
        hs.sometext = 'default value';
        hs.getText = getText;
        hs.clearText = clearText;
        hs.setText = setText;

        // define functions
        function getText() {
            return hs.sometext;
        }
        function clearText() {
            hs.sometext = '';
            return hs.sometext;
        }
        function setText(text) {
            hs.sometext = text;
        }
    }

}());
