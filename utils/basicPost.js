/**
 * Created by Sorikairo on 17/08/2016.
 */


const basicPost = function(req, res, Model, next) {
    if (req.body) {
        var newObject = new Model(req.body);
        newObject.save(function(err) {
            if (err) return res.status(500).json({success: false, data: err});
            if (next) {
                return next(req, res, newObject);
            }
            else {
                return res.json({success: true, data: newObject});
            }
        });
    }
    else {
        return res.status(404).json({success: false, data: {error: {message: 'RequestBodyMissing'}}});
    }
};

module.exports = basicPost;