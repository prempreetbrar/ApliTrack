const factory = require("./controllerFactory");
const Applicant = require("../models/applicantModel");

exports.createApplicant = factory.createOne(Applicant.Applicant);
exports.createCertification = factory.createOne(
  Applicant.ApplicantCertification
);
