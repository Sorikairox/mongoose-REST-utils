/**
 * Created by Sorikairo on 17/08/2016.
 */

const basicPut = function (req, res, Model, next) {
  if (req.body) {
    Model.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, updatedObject) {
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
    return res.status(400).json({success: false, message: utils_message.MISSING_OBJECT});
  }
};

module.exports = basicPut;