import { Op, Sequelize } from "sequelize";

const errorHandling = require("../utils/errorHandling");
const factory = require("./controllerFactory");
const Application = require("../models/applicationModel");

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
exports.getAllApplications = getAllApplicationCategory();
exports.getAllApplicantApplications = factory.getAll(Application.Application);

exports.getAllApplicationCategories = factory.getAll(Application.Appl_Category);

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

exports.getAllApplicationURL = factory.getAll(Application.Appl_Relevant_URL);
exports.addFilterApplication = factory.addFilter("ApplicationID");
exports.addFilterApplicant = factory.addFilter("ApplicantUsername");
exports.addSearchNameStatusDate = factory.addSearch(
  ["AName", "String"],
  ["Status", "String"],
  ["DateSubmitted", "DateRange"]
);

exports.addSearchCategory = errorHandling.catchAsync(
  async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    if (request.body["Category"] || request.query["Category"]) {
      request.body.filter["$Category.Category$"] = {
        [Op.like]: `%${request.body["Category"] || request.query["Category"]}%`,
      };
    }

    next();
  }
);

function getAllApplicationCategory() {
  return errorHandling.catchAsync(async (request, response) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }
    if (!request.body.order) {
      request.body.order = [];
    }

    console.log(request.body.filter);
    console.log("TEST 2", request.body.ApplicantUsername);

    let documents2 = await Application.Application.findAll({
      order: request.body.order,
      attributes: { exclude: [] }, // Include all columns
      include: [
        {
          model: Application.Appl_Category,
          as: "Category",
          where: Sequelize.literal(`
            Application.ApplicantUsername LIKE '%${request.body.ApplicantUsername}%' AND
            Category.ApplicationID = Application.ApplicationID
          `), 

          // include: [
          //   {
          //     model: Application.Appl_Category, 
          //     as: "NestedCategory",
          //     where: Sequelize.literal(`
          //       NestedCategory.ApplicationID = Application.ApplicationID
          //     `),
          //   },
          // ]
        },
        // {
        //   model: Application.Appl_Category,
        //   as: "Category",
        //   where: [Sequelize.literal(`
        //     Application.ApplicantUsername LIKE '%${request.body.ApplicantUsername}%' AND
        //     Category.ApplicationID = Application.ApplicationID
        //   `)],
        // },
    ],

    });

    // documents = await documents.findAll({
    //   attributes: { exclude: ["Category"] },
    // });

    // documents = await documents.findAll({
    //   include: [
    //     {
    //       model: Application.Application.Appl_Category,
    //       as: "Category",
    //     },
    //   ],
    // });

    console.log("BEFORE", documents2);

    //let documents = documents2.filter((object) => object.dataValues.Category.includes("Submitted"));
    let documents = documents2;

    console.log("AFTER", documents);

    response.status(200).json({
      status: "success",
      data: {
        [Application.Application.name.toLowerCase()]: documents,
      },
    });
  });
}

exports.addSort = factory.addSort();
