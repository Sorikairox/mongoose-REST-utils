/**
 * Created by Sorikairo on 17/08/2016.
 */

const basicDelete = function (req, res, Model, next) {

    Model.findOneAndRemove({_id: req.params.id}, function (err) {
        if (err)
            return res.status(500).json({success: false, data: err});
        return res.status(200).json({success: true});
    });
};

module.exports = basicDelete;