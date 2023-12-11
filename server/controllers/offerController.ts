const path = require("path");
const fs = require("fs");

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

const util = require("util");
const readdir = util.promisify(fs.readdir);

exports.uploadFile = errorHandling.catchAsync(
  async (request, response, next) => {
    // Check if a file was uploaded
    if (!request.file) {
      next();
      return;
    }

    let fileName = request.file.originalname;
    // // Read files asynchronously using Promise
    const files = await readdir("./uploads/offers");

    if (files) {
      // Update fileName with the special name
      fileName =
        fileName.split(".")[0] +
        " - [" +
        files.length +
        "]." +
        fileName.split(".")[1];
    }

    request.body.OfferFileName = fileName;
    next();
  }
);
