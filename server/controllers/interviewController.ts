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

  exports.filterApplicant = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        ApplicantUsername: request.body.ApplicantUsername,
      };
      next();
    }
  );