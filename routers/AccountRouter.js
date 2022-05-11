const express = require('express');
const Router = express.Router();
const Account = require('../models/AccountModel');
const registerValidator = require('./validators/registerValidator');
const loginValidator = require('./validators/loginValidator');
const { render } = require('express/lib/response');

var generator = require('generate-password');
//Tự tạo mật khẩu
var password = generator.generate({
    length: 6,
    numbers: true
});
//Tạo username tự động(chưa so sánh username đã có hay chưa)
var username = generator.generate({
    length: 10,
    numbers: true,
    exclude: ''
});

Router.get('/', loginValidator, (req, res) => {
    res.render('login');
});
Router.get('/register', registerValidator, (req, res) => {
    res.render('register');
});
module.exports = Router;