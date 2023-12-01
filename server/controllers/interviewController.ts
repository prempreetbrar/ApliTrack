const factory = require("./controllerFactory");
const Interview = require("../models/interviewModel");

exports.createInterview = factory.createOne(Interview.Interview);
exports.deleteInterview = factory.deleteInstance(Interview.Interview);
exports.updateInterview = factory.updateInstance(Interview.Interview);