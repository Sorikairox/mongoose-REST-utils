/**
 * Created by Sorikairo on 17/08/2016.
 */


var express = require('express');
var app = express();
const utils_message = require("./utils_message");

const basicPut = function (req, res, Model, next) {
    if (req.body.data) {
        Model.findByIdAndUpdate(req.body.data._id, req.body.data, {new: true}, function (err, updatedObject) {
            if (err) throw err;
            if (next) {
                return next(req, res, updatedObject);
            }
            else {
                return res.json({success: true, data: updatedObject});
            }
        });
    }
    else {
        return res.status(400).json({success: false, message: utils_message.MISSING_OBJECT});
    }
};

module.exports = basicPut;