const factory = require("./controllerFactory");
const Offer = require("../models/offerModel");

exports.createOffer = factory.createOne(Offer.Offer);
exports.deleteOffer = factory.deleteInstance(Offer.Offer);
exports.updateOffer = factory.updateInstance(Offer.Offer);

exports.getOffer = factory.getOne(Offer.Offer);
exports.getAllOffers = factory.getAll(Offer.Offer);

exports.addFilterApplicant = factory.addFilter("ApplicantUsername");
exports.addSearchCompensationResponseDeadlineStartDate = factory.addSearch(
  ["Compensation", "Range"],
  ["ResponseDeadline", "DateRange"],
  ["StartDate", "DateRange"]
);
exports.addSortCompensationResponseDeadlineStartDate = factory.addSort();

exports.uploadOfferStorage = factory.uploadStorage("./uploads/offers");
exports.uploadOfferFile = factory.uploadFile(
  "./uploads/offers",
  "OfferFileName"
);
