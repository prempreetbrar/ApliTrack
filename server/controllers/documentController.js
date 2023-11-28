const factory = require("./controllerFactory");
const Document = require("../models/documentModel");

exports.createDocument = factory.createOne(Document.Document);
exports.deleteDocument = factory.deleteInstance(Document.Document);
exports.updateDocument = factory.updateInstance(Document.Document);