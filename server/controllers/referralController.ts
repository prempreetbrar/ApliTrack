const factory = require("./controllerFactory");
const Referral = require("../models/referralModel");

exports.createReferral = factory.createOne(Referral.Referral);
exports.deleteReferral = factory.deleteInstance(Referral.Referral);
exports.updateReferral = factory.updateInstance(Referral.Referral);

exports.getReferral = factory.getOne(Referral.Referral);
exports.getAllReferrals = factory.getAll(Referral.Referral);

exports.addFilterID = factory.addFilter("ReferralID");
exports.addFilterApplicantAndContact = factory.addFilter(
  "ApplicantUsername",
  "ContactID"
);
