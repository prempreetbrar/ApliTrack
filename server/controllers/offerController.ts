const factory = require("./controllerFactory");
const Offer = require("../models/offerModel");
const errorHandling = require("../utils/errorHandling");

exports.createOffer = factory.createOne(Offer.Offer);
exports.deleteOffer = factory.deleteInstance(Offer.Offer);
exports.updateOffer = factory.updateInstance(Offer.Offer);

exports.getOffer = factory.getOne(Offer.Offer);
exports.getAllOffers = factory.getAll(Offer.Offer);
exports.getAllApplicantOffers = factory.getAll(Offer.Offer);

exports.filterApplicantFile = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicantUsername: request.body.ApplicantUsername,
        OfferFileName: request.body.OfferFileName,
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