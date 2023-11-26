const factory = require("./controllerFactory");
const Applicant = require("../models/applicantModel");

exports.createApplicant = factory.createOne(Applicant);
