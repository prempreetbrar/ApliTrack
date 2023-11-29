const factory = require("./controllerFactory");
const Offer = require("../models/offerModel");

exports.createOffer = factory.createOne(Offer.Offer);