const factory = require("./controllerFactory");
const interviewFactory = require("./interviewFactory");
const Interview = require("../models/interviewModel");
const errorHandling = require("../utils/errorHandling");

exports.createInterview = factory.createOne(Interview.Interview);
exports.deleteInterview = interviewFactory.deleteOneInterview(Interview.Interview);