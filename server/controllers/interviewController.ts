const { Op } = require("sequelize");
const factory = require("./controllerFactory");
const Interview = require("../models/interviewModel");
const errorHandling = require("../utils/errorHandling");

exports.createInterview = factory.createOne(Interview.Interview);
exports.deleteInterview = factory.deleteInstance(Interview.Interview);
exports.updateInterview = factory.updateInstance(Interview.Interview);

exports.getInterview = factory.getOne(Interview.Interview);
exports.getAllInterviews = factory.getAll(Interview.Interview);
exports.getAllApplicantInterviews = factory.getAll(Interview.Interview);

exports.filterID = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        InterviewID: request.body.InterviewID,
      };
      next();
    }
  );

  //not being used anymore
  exports.filterApplicant = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicantUsername: request.body.ApplicantUsername,
      };
      next();
    }
  );

  //being used for front-end
  exports.addFilter = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {ApplicantUsername: request.body.ApplicantUsername};
      if (request.body.InterviewID || request.query.InterviewID) {
        request.body.filter.InterviewID =
          request.body.InterviewID || request.query.InterviewID;
      }
      if (request.body.Stage || request.query.Stage) {
        request.body.filter.Stage = {
          [Op.like]: `%${request.body.Stage || request.query.Stage}%`,
        };
      }
      if (
        request.query.fromDate &&
        request.query.toDate &&
        request.query.fromDate !== "MM/DD/YYYY" &&
        request.query.toDate !== "MM/DD/YYYY"
      ) {
        request.body.filter.Date = {
          [Op.between]: [
            request.query.fromDate,
            request.query.toDate,
          ],
        };
      } else if (
        request.query.fromDate &&
        request.query.fromDate !== "MM/DD/YYYY"
      ) {
        request.body.filter.Date = {
          [Op.gte]: request.query.fromDate,
        };
      } else if (
        request.query.toDate &&
        request.query.toDate !== "MM/DD/YYYY"
      ) {
        request.body.filter.Date = {
          [Op.lte]: request.query.toDate,
        };
      }
      next();
    }
  );