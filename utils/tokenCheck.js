/**
 * Created by Sorikairo on 17/08/2016.
 */


var express = require('express');
var config = require("../../../Togeather%20API/config"); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Customer = require('./models/customer'); // get our mongoose model
var app = express();

app.set('superSecret', config.secret); // secret variable

var tokenCheck = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(500).send({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                if (req.body.email)
                    var email = req.body.email;
                else
                    var email = req.query.email;

                Customer.findOne({email: email}, function (err, customer) {
                    if (err) throw err;
                    if (!customer) {
                        return res.status(403).send({
                            success: false,
                            message: 'NoCustomer'
                        });
                    }
                    else {
                        delete(customer.password);
                        req.actualCustomer = customer;
                        next(req, res);
                    }
                })
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'NoToken'
        });

    }
};

module.exports = tokenCheck;