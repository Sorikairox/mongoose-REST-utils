/**
 * Created by Sorikairo on 17/08/2016.
 */


var express = require('express');
var app = express();
const utils_message = require("./utils_message");

const basicPost = function (req, res,  Model, next) {
    if (req.body.data) {
        var newObject = new Model(req.body.data);
        newObject.save(function (err) {
            if (err) throw err;
            if (next) {
                return next(req, res, newObject);
            }
            else {
                return res.json({success: true, data: newObject});
            }
        });
    }
    else {
        return res.status(400).json({success: false, message: utils_message.MISSING_OBJECT});
    }
};

module.exports = basicPost;