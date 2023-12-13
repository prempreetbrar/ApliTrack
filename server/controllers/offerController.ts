import { Op } from "sequelize";

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
    if (!request.body.filter) {
      request.body.filter = {};
    }

    request.body.filter.ApplicantUsername = request.body.ApplicantUsername;
    request.body.filter.OfferFileName = request.body.OfferFileName;
    next();
  }
);

exports.filterApplicant = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    request.body.filter.ApplicantUsername = request.body.ApplicantUsername;
    next();
  }
);

exports.addSearch = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    if (!request.body.order) {
      request.body.order = [];
    }

    if (
      request.query.LowestCompensation &&
      request.query.HighestCompensation &&
      request.query.LowestCompensation !== "" &&
      request.query.HighestCompensation !== ""
    ) {
      request.body.filter.Compensation = {
        [Op.between]: [
          request.query.LowestCompensation,
          request.query.HighestCompensation,
        ],
      };
    } else if (
      request.query.LowestCompensation &&
      request.query.LowestCompensation !== ""
    ) {
      request.body.filter.Compensation = {
        [Op.gte]: request.query.LowestCompensation,
      };
    } else if (
      request.query.HighestCompensation &&
      request.query.HighestCompensation !== ""
    ) {
      request.body.filter.Compensation = {
        [Op.lte]: request.query.HighestCompensation,
      };
    }

    if (
      request.query.EarliestResponseDeadline &&
      request.query.LatestResponseDeadline &&
      request.query.EarliestResponseDeadline !== "MM/DD/YYYY" &&
      request.query.LatestResponseDeadline !== "MM/DD/YYYY"
    ) {
      request.body.filter.ResponseDeadline = {
        [Op.between]: [
          request.query.EarliestResponseDeadline,
          request.query.LatestResponseDeadline,
        ],
      };
    } else if (
      request.query.EarliestResponseDeadline &&
      request.query.EarliestResponseDeadline !== "MM/DD/YYYY"
    ) {
      request.body.filter.ResponseDeadline = {
        [Op.gte]: request.query.EarliestResponseDeadline,
      };
    } else if (
      request.query.LatestResponseDeadline &&
      request.query.LatestResponseDeadline !== "MM/DD/YYYY"
    ) {
      request.body.filter.ResponseDeadline = {
        [Op.lte]: request.query.LatestResponseDeadline,
      };
    }

    if (
      request.query.EarliestStartDate &&
      request.query.LatestStartDate &&
      request.query.EarliestStartDate !== "MM/DD/YYYY" &&
      request.query.LatestStartDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.StartDate = {
        [Op.between]: [
          request.query.EarliestStartDate,
          request.query.LatestStartDate,
        ],
      };
    } else if (
      request.query.EarliestStartDate &&
      request.query.EarliestStartDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.StartDate = {
        [Op.gte]: request.query.EarliestStartDate,
      };
    } else if (
      request.query.LatestStartDate &&
      request.query.LatestStartDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.StartDate = {
        [Op.lte]: request.query.LatestStartDate,
      };
    }

    if (request.query.Sort) {
      request.body.order.push(request.query.Sort.split("-"));
    }

    next();
  }
);

exports.uploadOfferFile = factory.uploadFile(
  "./uploads/offers",
  "OfferFileName"
);
