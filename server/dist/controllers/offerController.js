"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory = require("./controllerFactory");
const Offer = require("../models/offerModel");
exports.createOffer = factory.createOne(Offer.Offer);
exports.deleteOffer = factory.deleteInstance(Offer.Offer);
exports.updateOffer = factory.updateInstance(Offer.Offer);
