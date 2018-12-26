/**
 * Created by Sorikairo on 17/08/2016.
 */

const basicPut = function(req, res, Model, next) {
    if (req.body) {
        Model.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, updatedObject) {
            if (err) return res.status(500).json({success: false, data: err});
            if (next) {
                return next(req, res, updatedObject);
            }
            else {
                return res.json({success: true, data: updatedObject});
            }
        });
    }
    else {
        return res.status(404).json({success: false, data: {error: {message: 'RequestBodyMissing'}}});
    }
};

module.exports = basicPut;