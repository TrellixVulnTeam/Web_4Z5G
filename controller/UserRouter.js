const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const History=require('../models/TransactionModel');
const CheckLogin = require('../auth/CheckForUser');
const FirstTime = require('../auth/CheckFirstTime');
const currencyFormatter = require('currency-formatter');
const changePassValidator = require('../routers/validators/changePassValidator');
const { validationResult } = require('express-validator');
const Router = express.Router();
//profile
Router.get('/', CheckLogin, FirstTime, (req, res) => {
    let id = req.session.account._id;
    Account.findById(id, (err, data) => {
        return res.render('user', {
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            birthday: data.birthday,
            idcard_front: "",
            idcard_back: "",
            account_balance: currencyFormatter.format(data.account_balance, {
                symbol: 'đ',
                thousand: ',',
                precision: 1,
                format: '%v %s'
            }),
            status: data.status
        });
    });
});
//Nạp tiền
Router.get('/addMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('addMoney', {
        error: '',
        fullname: user.fullname
    });
});
Router.post('/addMoney', CheckLogin, FirstTime, (req, res) => {
    let id = req.session.account._id;
    let {
        numberCard,
        dateExp,
        cvv,
        money
    } = req.body;
    money = parseInt(money);
    Account.findById(id, (err, data) => {
        if (numberCard === '111111') {
            if (dateExp === '2022-10-10') {
                if (cvv === '411') {
                    Account.findByIdAndUpdate(id, {
                        account_balance: data.account_balance + money
                    }).then(() => {
                        return res.redirect('/user/addMoney?message=addmoneysuccess');
                    }).catch(err => {
                        return res.render('addMoney', {
                            error: err.message,
                            fullname: data.fullname
                        });
                    })
                } else {
                    return res.render('addMoney', {
                        error: 'Sai mã cvv',
                        fullname: data.fullname
                    });
                }
            } else {
                return res.render('addMoney', {
                    error: 'Sai ngày hết hạn',
                    fullname: data.fullname
                });
            }
        } else if (numberCard === '222222') {
            if (dateExp === '2022-11-11') {
                if (cvv === '443') {
                    if (money > 1000000) {
                        return res.render('addMoney', {
                            error: 'Chỉ được nạp tối đa 1 triệu',
                            fullname: data.fullname
                        });
                    } else {
                        Account.findByIdAndUpdate(id, {
                            account_balance: data.account_balance + money
                        }).then(() => {
                            return res.redirect('/user/addMoney');
                        }).catch(err => {
                            return res.render('addMoney', {
                                error: err.message,
                                fullname: data.fullname
                            });
                        })
                    }
                } else {
                    return res.render('addMoney', {
                        error: 'Sai mã cvv',
                        fullname: user.fullname
                    });
                }
            } else {
                return res.render('addMoney', {
                    error: 'Sai ngày hết hạn',
                    fullname: user.fullname
                });
            }
        } else if (numberCard === '333333') {
            if (dateExp === '2022-12-12') {
                if (cvv === '577') {
                    return res.render('addMoney', {
                        error: 'Thẻ hết tiền',
                        fullname: data.fullname
                    })
                } else {
                    return res.render('addMoney', {
                        error: 'Sai mã cvv',
                        fullname: data.fullname
                    });
                }
            } else {
                return res.render('addMoney', {
                    error: 'Sai ngày hết hạn',
                    fullname: data.fullname
                });
            }
        } else if (numberCard.length === 6) {
            return res.render('addMoney', {
                error: 'Thẻ này không được hỗ trợ',
                fullname: data.fullname
            })
        } else {
            return res.render('addMoney', {
                error: 'Sai mã thẻ',
                fullname: data.fullname
            });
        }
    });

});
//Rút tiền - bắt đầu
Router.get('/withdrawMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('withdrawMoney', {
        error: '',
        fullname: user.fullname
    });
});













Router.post('/withdrawMoney', CheckLogin, FirstTime, (req, res) => {
    let id = req.session.account._id;
    let {
        numberCard,
        dateExp,
        cvv,
        money
    } = req.body;
    money = parseInt(money);
    Account.findById(id, (err, data) => {
        if (numberCard === '111111') {
            if (dateExp === '2022-10-10') {
                if (cvv === '411') {
                    if (money > data.account_balance) {
                        return res.render('withdrawMoney', {
                            error: 'Số dư không đủ',
                            fullname: data.fullname
                        });
                    } else if(money % 50 != 0){
                        return res.render('withdrawMoney', {
                            error: 'Số tiền rút phải là bội số của 50',
                            fullname: data.fullname
                    });
                } else{
                    Account.findByIdAndUpdate(id, {
                        account_balance: data.account_balance - money - (money * 0.05)
                    }).then(() => {
                        return res.redirect('/user/withdrawMoney?message=withdrawmoneysuccess');
                    }).catch(err => {
                        return res.render('withdrawMoney', {
                            error: err.message,
                            fullname: data.fullname
                        });
                    })
                } 
            }else {
                    return res.render('withdrawMoney', {
                        error: 'Sai mã cvv',
                        fullname: data.fullname
                    });
                }
            } else {
                return res.render('withdrawMoney', {
                    error: 'Sai ngày hết hạn',
                    fullname: data.fullname
                });
            }
        }  else if (numberCard.length === 6) {
            return res.render('withdrawMoney', {
                error: 'Thẻ này không được hỗ trợ',
                fullname: data.fullname
            })
        } else {
            return res.render('withdrawMoney', {
                error: 'Sai mã thẻ',
                fullname: data.fullname
            });
        }
    });

});

// Rút tiền - kết thúc




























//Chuyển tiền
Router.get('/transferMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('transferMoney', { fullname: user.fullname });
});
//Mua thẻ cào
Router.get('/buyCard', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('buyCard', { fullname: user.fullname });
});
//Xem lịch sử giao dịch - bắt đầu
Router.get('/history',CheckLogin, FirstTime,(req, res) => {
    let user = req.session.account;
    History.find({}).then(his=>{
        res.render('history',{ his:his,fullname: user.fullname})
    })

    // const history=await History.find();
    //  let list= [res.json(history)]
    //   res.render('history',{his:list});

});

// Xem lịch sử giao dịch - kết thúc
//Đổi mật khẩu
Router.get('/changePassworduser', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('changePassworduser', { error: '', fullname: user.fullname });
});
Router.post('/changePassworduser', changePassValidator, (req, res) => {
    let user = req.session.account;
    let { oldpass, confirm1, confirm2 } = req.body;
    let result = validationResult(req);
    if (result.errors.length === 0) {
        if (req.session.account) {
            if (bcrypt.compareSync(oldpass, user.password)) {
                if (confirm1 === confirm2) {
                    bcrypt.hash(confirm2, 10).then(hashed => {
                        Account.findByIdAndUpdate(req.session.account._id, {
                            password: hashed,
                        }).then(() => {
                            return res.redirect('/user/changePassworduser');
                        })
                    }).catch(err => {
                        return res.render('changePassworduser', {
                            error: err.message
                        });
                    })
                } else {
                    return res.render('changePassworduser', {
                        error: 'Mật khẩu không khớp',
                        fullname: user.fullname
                    });
                }
            } else {
                return res.render('changePassworduser', {
                    error: 'Mật khẩu cũ không đúng',
                    fullname: user.fullname
                });
            }
        } else {
            res.redirect('/');
        }
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        res.render('changePassworduser', {
            error: message,
            fullname: user.fullname

        });
    }

});
//Logout
Router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//up hình bổ sung
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, 'public/uploads');

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });
var multipleUpload = upload.fields([{name:'idcard_front'},{name:'idcard_back'}]);


Router.post('/updateprofile',multipleUpload, (req, res) => {
    let {

        idcard_front=req.files.idcard_front[0].originalname,
        idcard_back =req.files.idcard_back[0].originalname,

    } = req.body;
        if (req.session.account) {
            Account.findByIdAndUpdate(req.session.account._id, {
                idcard_front: idcard_front,
                idcard_back: idcard_back,
                status:0,
            }).then(() => {
                return res.redirect('/user');
            })
        } else {
            res.redirect('/user');
        }
   

});





module.exports = Router;