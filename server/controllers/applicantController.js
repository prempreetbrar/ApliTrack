const factory = require("./controllerFactory");
const Applicant = require("../models/applicantModel");

exports.createApplicant = factory.createOne(Applicant.Applicant);

exports.deleteApplicant = factory.deleteInstance(Applicant.Applicant);
