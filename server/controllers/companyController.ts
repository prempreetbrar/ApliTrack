import { Op } from "sequelize";

const factory = require("./controllerFactory");
const Company = require("../models/companyModel");
const errorHandling = require("../utils/errorHandling");

exports.createCompany = factory.createOne(Company.Company);
exports.deleteCompany = factory.deleteInstance(Company.Company);
exports.updateCompany = factory.updateInstance(Company.Company);

exports.getCompany = factory.getOne(Company.Company);
exports.getAllCompanies = factory.getAll(Company.Company);

exports.addFilter = errorHandling.catchAsync(
  async (request, response, next) => {
    request.body.filter = {
      CompanyName: request.body.CompanyName,
    };
    next();
  }
);

exports.addSearch = errorHandling.catchAsync(
  async (request, response, next) => {
    request.body.filter = {};

    if (request.query.CompanyName) {
      request.body.filter.CompanyName = {
        [Op.like]: `%${request.query.CompanyName}%`,
      };
    }

    next();
  }
);
