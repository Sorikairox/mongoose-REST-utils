/**
 * Created by Sorikairo on 17/08/2016.
 */


var express = require('express');
var app = express();
const utils_message = require("./utils_message");
const paginateGet = require("./paginateGet");

const basicGet = function (req, res, Model, next) {
    var options = {};
    var populateArray = [];
    for (var key in req.query) {
        if (key.indexOf("populate_nested_deep") != -1) {
            var value = key.split("_")[3] + "." + key.split("_")[4];
            populateArray.push({path: value, populate: {path: req.query[key]}});
        }
        else if (key.indexOf("populate_nested") != -1) {
            populateArray.push(key.split("_")[2] + "." + req.query[key]);
        }
        else if (key.indexOf("populate_") != -1) {
            populateArray.push(key.split("_")[1]);
        }
        else if (key.indexOf("not_") != -1) {
            options[key.split("_")[1]] = {"$ne": req.query[key]};
        }
        else {
            if (key != "limit" && key != 'page') {
                if (key == 'deal') {
                    let string = req.query[key];
                    req.query[key] = (req.query[key] == "true");
                    req.query[key] = {"$in": [string, req.query[key]]}
                }
                options[key] = req.query[key];
            }
        }
    }
    if (req.query.limit) {
        paginateGet(req, res, Model, populateArray, options);
    }
    else {

        Model.find(options).sort("-createdAt").populate(populateArray).exec(function (err, data) {
            if (err) throw err;
            if (next) {
                return next(req, res, data);
            }
            else {
                return res.json({success: true, data: data});
            }
        });
    }
};

module.exports = basicGet;