const factory = require("./controllerFactory");
const Document = require("../models/documentModel");
const errorHandling = require("../utils/errorHandling");

exports.createDocument = factory.createOne(Document.Document);
exports.deleteDocument = factory.deleteInstance(Document.Document);
exports.updateDocument = factory.updateInstance(Document.Document);

exports.getDocument = factory.getOne(Document.Document);
exports.getAllDocuments = factory.getAll(Document.Document);
exports.getAllApplicantDocuments = factory.getAll(Document.Document);

exports.filterID = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        DocumentID: request.body.DocumentID,
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