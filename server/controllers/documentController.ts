const factory = require("./controllerFactory");
const Document = require("../models/documentModel");

exports.createDocument = factory.createOne(Document.Document);
exports.deleteDocument = factory.deleteInstance(Document.Document);
exports.updateDocument = factory.updateInstance(Document.Document);

exports.getDocument = factory.getOne(Document.Document);
exports.getAllDocuments = factory.getAll(Document.Document);
exports.getAllApplicantDocuments = factory.getAll(Document.Document);
exports.addFilterApplicant = factory.addFilter("ApplicantUsername");
exports.addSearchDocFileName = factory.addSearch(
  ["DocFileName", "String"],
  ["DocType", "String"]
);
exports.addSort = factory.addSort();

exports.uploadDocumentStorage = factory.uploadStorage("./uploads/documents");
exports.uploadDocFile = factory.uploadFile(
  "./uploads/documents",
  "DocFileName"
);
