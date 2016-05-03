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
        lc.loggedin = recipeService.loggedin;
        lc.recipes = recipeService.recipes;
        lc.users = recipeService.users;
        lc.loginImage = "";
        // lc.$storage = $localStorage;
        // lc.message = lc.$storage.loginData ? "Logged in to " + lc.$storage.loginData.provider : "No login data found.";

        getUser();

        function getUser() {
            $http.get('/api/getuser').catch(function(err) {
                console.log(err);
            }).then(function(response) {
                if (response.data == "") {
                    console.log("No current user found!");
                } else {
                    if (response.data.provider == 'facebook') {
                        lc.loginImage = "/img/fb.png";
                    } else {
                        lc.loginImage = response.data._json.image.url;
                    }
                    recipeService.loggedin.username = response.data.displayName;
                    $("#loginImage").css("display", "block");
                    lc.loginHideGoogle = true;
                    lc.loginHide = true;
                    lc.loginName = "Logout";
                    recipeService.loggedin.user = response.data.id;
                    recipeService.loggedin.loggedin = true;
                    recipeService.login();
                }
            });
        }

        // This function sets up some data & dom objects.
        function brandon(authData) {
            console.log(authData);
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
                    console.log(res.config.data.username);
                    recipeService.loggedin.username = res.config.data.username;
                    $("#loginDef").css("display", "block");
                    lc.loginName = "Logout";
                }).catch((err) => {
                    console.log('login error:', err);
                });
            }
        }

//logout
        // this removes google data from the app and the server.
        function deleteData() {
            $http.get('/api/logout').then((res) => {
                // lc.$storage.loginData = {};
                lc.message = 'login data deleted.';
                recipeService.loggedin.user = "";
                recipeService.loggedin.username = "";
                recipeService.loggedin.loggedin = false;
                lc.loginName = "Login";
                lc.loginHideGoogle = false;
                $("#loginDef").css("display", "none");
                lc.loginHideNative = true;
            }).catch((err) => {
                console.log("Logout Error!", err);
            });
        }

// Create native user - passes user/pass to server, which generates and logs you in.
        function create() {
            var newUser = {
                email: lc.createEmail,
                password: lc.createPassword
            };
            
            $http.post('/api/newLogin', newUser).then((res) => {
                if (res.data.error) {
                    console.log("User Exists!");
                } else {
                    console.log("User Created.");
                }
            }).catch((err) => {
                console.error("login creation error:", err);
            });
        }

// Change email.
        function changeEmail() {
            var emailChange = {
                oldEmail: lc.oldEmail,
                newEmail: lc.newEmail,
                password: lc.password
            };

            $http.post('/api/changeEmail', emailChange).then((res) => {
                console.log(res);
                if (res.data == "Failed") {
                    console.log("Failed to update email. Either your old email or your password are wrong.");
                } else {
                    console.log("Email successfully updated.");
                }

            }).catch((err) => {
                console.error("Email change error", err);
            });

            // ref.changeEmail({
            //     oldEmail: lc.oldEmail,
            //     newEmail: lc.newEmail,
            //     password: lc.password
            // }, function (error) {
            //     $timeout(function () {
            //         if (error === null) {
            //             console.log("Email changed successfully");
            //             lc.successHide = true;
            //             lc.failHide = false;
            //             lc.emailFail = false;
            //
            //         } else {
            //             console.log("Error changing email:", error);
            //             lc.failHide = true;
            //             lc.emailFail = true;
            //             lc.successHide = false;
            //         }
            //     });
            // });
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