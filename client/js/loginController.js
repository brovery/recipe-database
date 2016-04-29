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
        lc.loginData = $localStorage['firebase:session::geo-recipes'];
        lc.message = lc.loginData ? "Logged in to " + lc.loginData.provider : "No login data found.";

        // IMPORTANT: change to match the URL of your Firebase.
        var url = 'https://geo-recipes.firebaseio.com/';
        var ref = new Firebase(url);

        if (lc.loginData) {
            if (lc.loginData.provider == "password") {
                recipeService.loggedin.username = lc.loginData[lc.loginData.provider].email;
                $("#loginDef").css("display", "block");
                lc.loginHideNative = true;
            } else {
                recipeService.loggedin.username = lc.loginData[lc.loginData.provider].displayName;
                lc.loginImage = lc.loginData[lc.loginData.provider].profileImageURL;
                $("#loginImage").css("display", "block");
                lc.loginHideGoogle = true;
            }
            lc.loginHide = true;
            lc.loginName = "Logout";
            recipeService.loggedin.user = lc.loginData.uid;
            recipeService.loggedin.loggedin = true;
            console.log(recipeService.loggedin);

            recipeService.login();
        }

        function brandon(authData) {
            console.log(authData);

            if (authData.provider == "password") {
                recipeService.loggedin.username = authData.password.email;
                $("#loginDef").css("display", "block");
            } else {
                recipeService.loggedin.username = authData[authData.provider].displayName;
                lc.loginImage = authData[authData.provider].profileImageURL;
                $("#loginImage").css("display", "block");
            }
            recipeService.loggedin.user = authData.uid;
            recipeService.loggedin.loggedin = true;
            recipeService.login();
        }

// Generic Login. This will log you in depending upon which link you click.
        function genericLogin(serv) {
            console.log(serv);


            // ref.authWithOAuthPopup(serv, function (error, authData) {
            //     if (error) {
            //         console.log('Log in to ' + serv + ' Failed', error);
            //         lc.message = 'Log in to ' + serv + ' Failed ' + error;
            //     } else {
            //         console.log('Logged in to ' + serv);
            //         lc.message = 'Logged in to ' + serv;
            //         lc.loginHide = true;
            //         lc.loginHideGoogle = true;
            //         lc.loginData = authData;
            //         brandon(authData);
            //         lc.loginName = "Logout";
            //     }
            // });
        }

//logout
        // this removes google data from local storage
        // to FULLY logout, you MUST go to google.com and logout
        function deleteData() {
            ref.unauth();
            $localStorage.$reset();
            lc.loginData = {};
            lc.message = 'google data deleted.';
            recipeService.loggedin.user = "";
            recipeService.loggedin.username = "";
            recipeService.loggedin.loggedin = false;
            lc.loginName = "Login";
            lc.loginHideGoogle = false;
            $("#loginDef").css("display", "none");
            lc.loginHideNative = true;
        }

//Native login
        function nativeLogin() {
            console.log('logging in');
            if (lc.email !== "" || lc.password !== "") {
                // call http login service.
                location += "login";
                $http.post(location, {username: lc.email, password: lc.password}).then(() => {
                    console.log('logged in');
                }).catch(() => {
                    console.log('login error');
                });
                
                

                // ref.authWithPassword({
                //     email: lc.email,
                //     password: lc.password
                // }, function (error, authData) {
                //     //console.log(error + authData);
                //     if (error) {
                //         console.log(error);
                //         $('#loginModal').modal('show');
                //         var wrong = "Bad username or Password";
                //     } else {
                //         lc.loginHide = true;
                //         lc.loginHideNative = true;
                //         lc.loginData = authData;
                //         brandon(authData);
                //         lc.loginName = "Logout";
                //     }
                // }, {
                //     //remember: "sessionOnly"
                //
                // });
            }
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