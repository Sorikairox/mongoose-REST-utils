/**
 * Created by Sorikairo on 9/24/2018.
 */

const countGet = function (req, res, Model, populateArray, options, next) {
    Model.countDocuments(options, function (err, data) {
        if (err) throw err;
        if (next) {
            return next(req, res, data);
        }
        else {
            return res.json({success: true, data: data});
        }
    });
};

module.exports = countGet;