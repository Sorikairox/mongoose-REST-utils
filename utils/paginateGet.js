/**
 * Created by Sorikairo on 17/08/2016.
 */


const paginateGet = function (req, res, Model, populateArray, options, sortString, noString, next) {
    Model.paginate(options, {
      select : noString,
        page: req.query.page,
        limit: req.query.limit,
        sort: sortString,
        populate : populateArray
    }, function (err, data) {
      if (err) return res.status(500).json({success : false, data : err});
      if (next) {
            return next(req, res, data);
        }
        else {
            return res.json({success: true, data: data});
        }
    });
};

module.exports = paginateGet;