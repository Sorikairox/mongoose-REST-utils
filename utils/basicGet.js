/**
 * Created by Sorikairo on 17/08/2016.
 */

const paginateGet = require("./paginateGet");
const countGet = require("./countGet");

const basicGet = function (req, res, Model, next) {
  var options = {};
  var populateArray = [];
  var sortString = "-createdAt";
  var noString = "-password";
  for (var key in req.query) {
    if (req.query[key] != undefined && req.query[key] != "undefined") {
      if (req.query[key] == "false")
        req.query[key] = false;
      if (req.query[key] == "true")
        req.query[key] = true;
      if (key.indexOf("populate_nested") != -1) {
        populateArray.push({path: key.split("_")[2], populate: {path: req.query[key]}});
      }
      else if (key.indexOf("populate_") != -1) {
        populateArray.push(key.split("_")[1]);
      }
      else if (key.indexOf("not_") != -1) {
        options[key.split("_")[1]] = {$ne: req.query[key]};
      }
      else if (key.indexOf("no_") != -1) {
        noString += " -" + key.split("_")[1];
      }
      else if (key.indexOf("like_") != -1) {
        options[key.split("_")[1]] = new RegExp(req.query[key], "i");
      }
      else if (key.indexOf("sort_") != -1) {
        sortString += ((req.query[key] == "asc") ? "" : "-") + key.split("_")[1];
      }
      else {
        if (key != "limit" && key != 'page')
          options[key] = req.query[key];
        else
          req.query[key] = Number.parseInt(req.query[key]);
      }
    }
  }
  if (req.query.limit && req.query.page) {
    paginateGet(req, res, Model, populateArray, options, sortString);
  }
  else if (req.query.count) {
    countGet(req, res, Model, options);
  }
  else {
    Model.find(options, noString).sort(sortString).populate(populateArray).exec(function (err, data) {
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