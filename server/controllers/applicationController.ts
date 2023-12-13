import { Op } from "sequelize";

const factory = require("./controllerFactory");
const Application = require("../models/applicationModel");
const errorHandling = require("../utils/errorHandling");

exports.createApplication = factory.createOne(Application.Application);
exports.createApplicationURL = factory.createOne(Application.Appl_Relevant_URL);
exports.createApplicationCategory = factory.createOne(
  Application.Appl_Category
);

exports.updateApplication = factory.updateInstance(Application.Application);

exports.deleteApplication = factory.deleteInstance(Application.Application);
exports.deleteApplicationURL = factory.deleteInstance(
  Application.Appl_Relevant_URL
);
exports.deleteApplicationCategory = factory.deleteInstance(
  Application.Appl_Category
);

exports.getApplication = factory.getOne(Application.Application);
exports.getAllApplications = factory.getAll(Application.Application);
exports.getAllApplicantApplications = factory.getAll(Application.Application);
exports.getAllApplicationCategories = factory.getAll(Application.Appl_Category);

exports.getAllApplicationURL = factory.getAll(Application.Appl_Relevant_URL);

exports.addFilterID = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }
    request.body.filter.ApplicationID = request.body.ApplicationID;

    next();
  }
);

exports.addFilterApplicant = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }
    console.log(request.body);
    request.body.filter.ApplicantUsername = request.body.ApplicantUsername;
    next();
  }
);

// for many-to-many relationships
exports.createApplicationCorrespondsToJob = factory.createOne(
  Application.ApplicationCorrespondsToJob
);
exports.deleteApplicationCorrespondsToJob = factory.deleteInstance(
  Application.ApplicationCorrespondsToJob
);
exports.updateApplicationCorrespondsToJob = factory.updateInstance(
  Application.ApplicationCorrespondsToJob
);
exports.getApplicationCorrespondsToJob = factory.getAll(
  Application.ApplicationCorrespondsToJob
);

exports.createApplicationSubmitWithDoc = factory.createOne(
  Application.ApplicationSubmitWithDoc
);
exports.deleteApplicationSubmitWithDoc = factory.deleteInstance(
  Application.ApplicationSubmitWithDoc
);

//being used for front-end
exports.addFilter = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    if (!request.body.order) {
      request.body.order = [];
    }

    if (request.body.ApplicationID || request.query.ApplicationID) {
      request.body.filter.ApplicationID =
        request.body.ApplicationID || request.query.ApplicationID;
    }
    if (request.body.AName || request.query.AName) {
      request.body.filter.AName = {
        [Op.like]: `%${request.body.AName || request.query.AName}%`,
      };
    }
    if (request.body.Status || request.query.Status) {
      request.body.filter.Status = {
        [Op.like]: `%${request.body.Status || request.query.Status}%`,
      };
    }
    if (request.body.Category || request.query.Category) {
      request.body.filter.Category = {
        [Op.like]: `%${request.body.Category || request.query.Category}%`,
      };
    }
    if (
      request.query.fromDate &&
      request.query.toDate &&
      request.query.fromDate !== "MM/DD/YYYY" &&
      request.query.toDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.DateSubmitted = {
        [Op.between]: [request.query.fromDate, request.query.toDate],
      };
    } else if (
      request.query.fromDate &&
      request.query.fromDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.DateSubmitted = {
        [Op.gte]: request.query.fromDate,
      };
    } else if (request.query.toDate && request.query.toDate !== "MM/DD/YYYY") {
      request.body.filter.DateSubmitted = {
        [Op.lte]: request.query.toDate,
      };
    }

    if (request.query.Sort) {
      request.body.order.push(request.query.Sort.split("-"));
    }

    next();
  }
);

exports.addFilterCategory = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    if (!request.body.order) {
      request.body.order = [];
    }

    if (request.body.ApplicationID || request.query.ApplicationID) {
      request.body.filter.ApplicationID =
        request.body.ApplicationID || request.query.ApplicationID;
    }
    if (request.body.Category || request.query.Category) {
      request.body.filter.Category = {
        [Op.like]: `%${request.body.Category || request.query.Category}%`,
      };
    }

    if (request.query.Sort) {
      request.body.order.push(request.query.Sort.split("-"));
    }

    next();
  }
);
