const factory = require("./controllerFactory");
const Company = require("../models/companyModel");
const Job = require("../models/jobModel");
const errorHandling = require("../utils/errorHandling");

exports.createCompany = factory.createOne(Company.Company);
exports.deleteCompany = factory.deleteInstance(Company.Company);
exports.updateCompany = factory.updateInstance(Company.Company);

exports.getCompany = factory.getOne(Company.Company);
exports.getAllCompanies = errorHandling.catchAsync(
  async (request, response) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }
    if (!request.body.order) {
      request.body.order = [];
    }
    if (!request.body.nestedFilter) {
      request.body.nestedFilter = {};
    }
    if (!request.body.nestedOrder) {
      request.body.nestedOrder = [];
    }

    const documents = await Company.Company.findAll({
      where: request.body.filter,
      order: request.body.order,
      include: [
        {
          model: Job.Job,
          as: "Jobs",
          separate: true,
          where: request.body.nestedFilter,
          order: request.body.nestedOrder,
        },
      ],
    });

    response.status(200).json({
      status: "success",
      data: {
        [Company.Company.name.toLowerCase()]: documents,
      },
    });
  }
);
exports.addFilterCompanyName = factory.addFilter("CompanyName");
exports.addSearchCompanyName = factory.addSearch(
  ["CompanyName", "String"],
  ["IndustryName", "String", "Nested"],
  ["Salary", "Range", "Nested"],
  ["PositionType", "String", "Nested"],
  ["PositionName", "String", "Nested"],
  ["ApplicationDeadline", "DateRange", "Nested"]
);
exports.addSortCompanyName = factory.addSort();
