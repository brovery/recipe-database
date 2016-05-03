(function () {
    'use strict';

    angular.module('loginController', [])
        .controller('loginController', loginController);

    loginController.$inject = ['recipeService', '$http'];

    function loginController(recipeService, $http) {

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
                    console.log(lc.loggedin.username);
                    $("#loginImage").css("display", "block");
                    lc.loginHideGoogle = true;
                    lc.loginHideNative = true;
                    lc.loginHide = true;
                    lc.loginName = "Logout";
                    recipeService.loggedin.user = response.data.id;
                    recipeService.loggedin.loggedin = true;
                    recipeService.login();
                }
            });
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
                    lc.failHide = true;
                    lc.failLoginHide = true;
                    lc.successHide = false;
                } else {
                    console.log("User Created.");
                    lc.successHide = true;
                    lc.failHide = false;
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
                    lc.failHide = true;
                    lc.emailFail = true;
                    lc.successHide = false;
                } else {
                    console.log("Email successfully updated.");
                    lc.successHide = true;
                    lc.failHide = false;
                    lc.emailFail = false;
                }

            }).catch((err) => {
                console.error("Email change error", err);
            });
        }

//Change password
        function changePassword() {
            var changePass = {
                email: lc.email,
                oldPassword: lc.oldPassword,
                newPassword: lc.newPassword
            };

            $http.post('/api/changePass', changePass).then((res) => {
                console.log(res);
                if (res.data == "Failed") {
                    console.log("Failed to update password. Either your email or password were incorrect.");
                    lc.failHide = true;
                    lc.passFail = true;
                    lc.successHide = false;
                } else {
                    console.log("Password successfully updated.")
                    lc.successHide = true;
                    lc.failHide = false;
                    lc.passFail = false;
                }
            });


        }
    }
}());