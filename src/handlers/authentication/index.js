'use strict';  
var Auth   = require('./auth');
var SignIn   = require('./signIn');
var SignUp = require('./signUp');
var VerifyAccount = require('./verifyAccount');

module.exports = {
    Auth:   Auth.main,
    SignIn: SignIn.main,
    SignUp: SignUp.main,
    VerifyAccount: VerifyAccount.main
}