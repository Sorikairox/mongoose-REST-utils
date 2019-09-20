/**
 * Created by Sorikairo on 17/08/2016.
 */

const paginateGet = require('./paginateGet');
const countGet = require('./countGet');

let whitelist_keyword = ['$or', '$and'];

const basicGet = function (req, res, Model, next) {
  var options = {};
  var populateArray = [];
  var sortString = '';
  var getterString = '';
  var exclusion = false;
  var inclusion = false;
  for (var key in req.query) {
    if (req.query[key] !== undefined && req.query[key] !== 'undefined') {
      if (req.query[key] === 'false')
        req.query[key] = false;
      if (req.query[key] === 'true')
        req.query[key] = true;
      if (key.indexOf('populate_nested') !== -1) {
        populateArray.push({path: key.split('_')[2], populate: {path: req.query[key]}});
      }
      else if (key.indexOf('populate_') !== -1) {
        populateArray.push(key.split('_')[1]);
      }
      else if (key.indexOf('only_') !== -1) {
        inclusion = true;
        if (!exclusion)
          getterString += ' ' + key.split('_')[1];
        else {
          return res.status('402').json({
            success: false,
            data: {error: 'CannotIncludeAndExcludePropertiesAtTheSameTime'}
          });
        }
      }
      else if (key.indexOf('not_') !== -1) {
        options[key.split('_')[1]] = {$ne: req.query[key]};
      }
      else if (key.indexOf('no_') !== -1) {
        exclusion = true;
        if (!inclusion)
          getterString += ' -' + key.split('_')[1];
        else {
          return res.status('402').json({
            success: false,
            data: {error: 'CannotIncludeAndExcludePropertiesAtTheSameTime'}
          });
        }
      }
      else if (key.indexOf('like_') !== -1) {
        options[key.split('_')[1]] = new RegExp(req.query[key], 'i');
      }
      else if (key.indexOf('sort_') !== -1) {
        sortString += ((req.query[key] === 'asc') ? ' ' : ' -') + key.split('_')[1];
      }
      else if (key.indexOf('greater_') !== -1) {
        options[key.split('_')[1]] = {$gt: req.query[key], ...options[key.split('_')[1]]};
      }
      else if (key.indexOf('lower_') !== -1) {
        options[key.split('_')[1]] = {$lt: req.query[key], ...options[key.split('_')[1]]};
      }
      else if (key.indexOf('exists_') !== -1) {
          options[key.split('_')[1]] = {$exists: req.query[key]};
      }
      else if (whitelist_keyword.includes(key)) {
          options[key] = req.query[key];
      }
      else {
        if (key !== 'limit' && key !== 'page') {
          if (typeof req.query[key] === 'string')
            options[key] = req.query[key];
          else
            options[key] = {$in: req.query[key]};
        }
        else
          req.query[key] = Number.parseInt(req.query[key]);
      }
    }
  }
  if (inclusion) {
    getterString = getterString.replace('password', '');
  }
  if (exclusion) {
    getterString += ' -password';
  }
  if (req.query.limit && req.query.page) {
    paginateGet(req, res, Model, populateArray, options, sortString, getterString, next);
  }
  else if (req.query.count) {
    countGet(req, res, Model, options);
  }
  else {
    Model.find(options, getterString).sort(sortString).populate(populateArray).exec(function (err, data) {
      if (err) return res.status(500).json({success: false, data: err});
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
