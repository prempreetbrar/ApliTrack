const factory = require("./controllerFactory");
const Company = require("../models/companyModel");

exports.createCompany = factory.createOne(Company.Company);
exports.deleteCompany = factory.deleteInstance(Company.Company);
exports.updateCompany = factory.updateInstance(Company.Company);

exports.getCompany = factory.getOne(Company.Company);
exports.getAllCompanies = factory.getAll(Company.Company);
exports.addFilterCompanyName = factory.addFilter("CompanyName");
exports.addSearchCompanyName = factory.addSearch(["CompanyName", "String"]);
exports.addSortCompanyName = factory.addSort();
