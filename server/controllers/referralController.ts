const factory = require("./controllerFactory");
const Referral = require("../models/referralModel");
const errorHandling = require("../utils/errorHandling");

exports.createReferral = factory.createOne(Referral.Referral);
exports.deleteReferral = factory.deleteInstance(Referral.Referral);
exports.updateReferral = factory.updateInstance(Referral.Referral);

exports.getReferral = factory.getOne(Referral.Referral);
exports.getAllReferrals = factory.getAll(Referral.Referral);
exports.getAllApplicantReferrals = factory.getAll(Referral.Referral);

exports.filterID = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ReferralID: request.body.ReferralID,
      };
      next();
    }
  );

  exports.filterApplicant = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicantUsername: request.body.ApplicantUsername,
      };
      next();
    }
  );