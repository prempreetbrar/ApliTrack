const factory = require("./controllerFactory");
const Application = require("../models/applicationModel");
const errorHandling = require("../utils/errorHandling");

exports.createApplication = factory.createOne(Application.Application);
exports.createApplicationURL = factory.createOne(Application.Appl_Relevant_URL);
exports.createApplicationCategory = factory.createOne(Application.Appl_Category);

exports.updateApplication = factory.updateInstance(Application.Application);

exports.deleteApplication = factory.deleteInstance(Application.Application);
exports.deleteApplicationURL = factory.deleteInstance(Application.Appl_Relevant_URL);
exports.deleteApplicationCategory = factory.deleteInstance(Application.Appl_Category);

exports.getApplication = factory.getOne(Application.Application);
exports.getAllApplications = factory.getAll(Application.Application);
exports.getAllApplicantApplications = factory.getAll(Application.Application);

exports.getAllApplicationURL = factory.getAll(Application.Appl_Relevant_URL);

exports.addFilterID = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicationID: request.body.ApplicationID,
      };
      next();
    }
  );

  exports.addFilterApplicant = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicantUsername: request.body.ApplicantUsername,
      };
      next();
    }
  );

// for many-to-many relationships
exports.createApplicationCorrespondsToJob = factory.createOne(Application.ApplicationCorrespondsToJob);
exports.deleteApplicationCorrespondsToJob = factory.deleteInstance(Application.ApplicationCorrespondsToJob);
exports.updateApplicationCorrespondsToJob = factory.updateInstance(Application.ApplicationCorrespondsToJob);
exports.getApplicationCorrespondsToJob = factory.getAll(Application.ApplicationCorrespondsToJob);

exports.createApplicationSubmitWithDoc = factory.createOne(Application.ApplicationSubmitWithDoc);
exports.deleteApplicationSubmitWithDoc = factory.deleteInstance(Application.ApplicationSubmitWithDoc);