const factory = require("./controllerFactory");
const Company = require("../models/companyModel");

exports.createCompany = factory.createOne(Company.Company);
exports.deleteCompany = factory.deleteInstance(Company.Company);
exports.updateCompany = factory.updateInstance(Company.Company);