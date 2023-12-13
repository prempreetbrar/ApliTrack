import { Op } from "sequelize";

const factory = require("./controllerFactory");
const Document = require("../models/documentModel");
const errorHandling = require("../utils/errorHandling");

exports.createDocument = factory.createOne(Document.Document);
exports.deleteDocument = factory.deleteInstance(Document.Document);
exports.updateDocument = factory.updateInstance(Document.Document);

exports.getDocument = factory.getOne(Document.Document);
exports.getAllDocuments = factory.getAll(Document.Document);
exports.getAllApplicantDocuments = factory.getAll(Document.Document);

exports.filterID = errorHandling.catchAsync(async (request, response, next) => {
  if (!request.body.filter) {
    request.body.filter = {};
  }

  request.body.filter.DocumentID = request.body.DocumentID;
  next();
});

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

    if (request.query.DocFileName) {
      request.body.filter.DocFileName = {
        [Op.like]: `%${request.query.DocFileName}%`,
      };
    }

    if (request.query.Sort) {
      request.body.order.push(request.query.Sort.split("-"));
    }

    next();
  }
);

exports.uploadDocFile = factory.uploadFile(
  "./uploads/documents",
  "DocFileName"
);
