(function () {
    'use strict';

    angular.module('loginController', [])
        .controller('loginController', loginController);

    loginController.$inject = ['$timeout', 'recipeService', '$localStorage', '$http'];

    function loginController($timeout, recipeService, $localStorage, $http) {

        // controller data and functions
        var lc = this;
        var location = 'http://localhost:3000/api/';
        lc.email = "";
        lc.password = "";
        lc.createEmail = "";
        lc.createPassword = "";
        lc.oldEmail = "";
        lc.oldPassword = "";
        lc.newEmail = "";
        lc.newPassword = "";
        lc.loginHide = false;
        lc.loginName = "Login";
        lc.successHide = false;
        lc.failHide = false;
        lc.deleteData = deleteData;
        lc.nativeLogin = nativeLogin;
        lc.create = create;
        lc.changeEmail = changeEmail;
        lc.changePassword = changePassword;
        lc.genericLogin = genericLogin;
        lc.loggedin = recipeService.loggedin;
        lc.recipes = recipeService.recipes;
        lc.users = recipeService.users;
        lc.loginImage = "";
        lc.$storage = $localStorage;
        lc.message = lc.$storage.loginData ? "Logged in to " + lc.$storage.loginData.provider : "No login data found.";

        // IMPORTANT: change to match the URL of your Firebase.
        // var url = 'https://geo-recipes.firebaseio.com/';
        // var ref = new Firebase(url);

        // This code will check for a user in localstorage, and use that if it exists.
        if (lc.$storage.loginData) {
            if (lc.$storage.loginData.provider == "password") {
                console.log("Pulling login data from localstorage");
                console.log(lc.$storage.loginData);
                recipeService.loggedin.username = lc.$storage.loginData.displayName;

                lc.loginHideNative = true;
                // $("#loginDef").css("display", "block");
            } else {
                recipeService.loggedin.username = lc.$storage.loginData[lc.$storage.loginData.provider].displayName;
                lc.loginImage = lc.$storage.loginData[lc.$storage.loginData.provider].profileImageURL;
                $("#loginImage").css("display", "block");
                lc.loginHideGoogle = true;
            }
            lc.loginHide = true;
            lc.loginName = "Logout";
            recipeService.loggedin.user = lc.$storage.loginData._id;
            recipeService.loggedin.loggedin = true;
            console.log(recipeService.loggedin);

            recipeService.login();
        }

        // This function sets up some data & dom objects.
        function brandon(authData) {
            if (authData.provider == "password") {
                recipeService.loggedin.username = authData.displayName;
                $("#loginDef").css("display", "block");
            } else {
                recipeService.loggedin.username = authData[authData.provider].displayName;
                lc.loginImage = authData[authData.provider].profileImageURL;
                $("#loginImage").css("display", "block");
            }
            recipeService.loggedin.user = authData._id;
            recipeService.loggedin.loggedin = true;
            // recipeService.login();
        }

//Native login
        function nativeLogin() {
            console.log('logging in');
            if (lc.email !== "" || lc.password !== "") {
                // call http login service.
                var loginLoc = location + "login";
                $http.post(loginLoc, {service: 'password', username: lc.email, password: lc.password}).then((res) => {
                    lc.loginHide = true;
                    lc.loginHideNative = true;
                    res.data.provider = "password";
                    res.data.password = "";
                    lc.$storage.loginData = res.data;
                    brandon(res.data);
                    lc.loginName = "Logout";
                }).catch((err) => {
                    console.log('login error:', err);
                });
            }
        }

// Generic Login. This will log you in depending upon which link you click.
        function genericLogin(serv) {
            console.log(serv);
            // location.href="http://localhost:3000/api/google";

            // $http.get('http://localhost:3000/api/google')
            //     .then(function(res) {
            //         console.log("response:", res);
            //         lc.message = 'Logged in to ' + serv;
            //         lc.loginHide = true;
            //         lc.loginHideGoogle = true;
            //         // lc.$storage.loginData = res;
            //     }).catch(function(err) {
            //         console.error(err);
            // });


            // ref.authWithOAuthPopup(serv, function (error, authData) {
            //     if (error) {
            //         console.log('Log in to ' + serv + ' Failed', error);
            //         lc.message = 'Log in to ' + serv + ' Failed ' + error;
            //     } else {
            //         console.log('Logged in to ' + serv);
            //         lc.message = 'Logged in to ' + serv;
            //         lc.loginHide = true;
            //         lc.loginHideGoogle = true;
            //         lc.$storage.loginData = authData;
            //         brandon(authData);
            //         lc.loginName = "Logout";
            //     }
            // });
        }

//logout
        // this removes google data from local storage
        // to FULLY logout, you MUST go to google.com and logout
        function deleteData() {
            // ref.unauth();
            $localStorage.$reset();
            // lc.$storage.loginData = {};
            lc.message = 'google data deleted.';
            recipeService.loggedin.user = "";
            recipeService.loggedin.username = "";
            recipeService.loggedin.loggedin = false;
            lc.loginName = "Login";
            lc.loginHideGoogle = false;
            $("#loginDef").css("display", "none");
            lc.loginHideNative = true;
        }

//Create native user - https://www.firebase.com/docs/web/guide/login/password.html
        function create() {
            ref.createUser({
                email: lc.createEmail,
                password: lc.createPassword
            }, function (error, userData) {
                $timeout(function () {
                    if (error) {
                        console.log("Error creating user:", error);
                        lc.failHide = true;
                        lc.failLoginHide = true;
                        lc.successHide = false;
                    } else {
                        console.log("Successfully created user account with uid:", userData.uid);
                        lc.successHide = true;
                        lc.failHide = false;
                    }
                });
            });
        }

//Change email - https://www.firebase.com/docs/web/guide/login/password.html
        function changeEmail() {
            ref.changeEmail({
                oldEmail: lc.oldEmail,
                newEmail: lc.newEmail,
                password: lc.password
            }, function (error) {
                $timeout(function () {
                    if (error === null) {
                        console.log("Email changed successfully");
                        lc.successHide = true;
                        lc.failHide = false;
                        lc.emailFail = false;

                    } else {
                        console.log("Error changing email:", error);
                        lc.failHide = true;
                        lc.emailFail = true;
                        lc.successHide = false;
                    }
                });
            });
        }

//Change password - https://www.firebase.com/docs/web/guide/login/password.html
        function changePassword() {
            ref.changePassword({
                email: lc.email,
                oldPassword: lc.oldPassword,
                newPassword: lc.newPassword
            }, function (error) {
                $timeout(function () {
                    if (error === null) {
                        console.log("Password changed successfully");
                        lc.successHide = true;
                        lc.failHide = false;
                        lc.passFail = false;
                    } else {
                        console.log("Error changing password:", error);
                        lc.failHide = true;
                        lc.passFail = true;
                        lc.successHide = false;
                    }
                });
            });
        }
    }
}());