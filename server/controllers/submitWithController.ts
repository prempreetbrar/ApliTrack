const factory = require("./controllerFactory");
const Submit_With = require("../models/submitWithModel");

exports.createSubmitWith = factory.createOne(Submit_With.Submit_With);
exports.deleteSubmitWith = factory.deleteInstance(Submit_With.Submit_With);