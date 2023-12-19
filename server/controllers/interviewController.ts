const factory = require("./controllerFactory");
const Interview = require("../models/interviewModel");

exports.createInterview = factory.createOne(Interview.Interview);
exports.deleteInterview = factory.deleteInstance(Interview.Interview);
exports.updateInterview = factory.updateInstance(Interview.Interview);

exports.getInterview = factory.getOne(Interview.Interview);
exports.getAllInterviews = factory.getAll(Interview.Interview);
exports.getAllApplicantInterviews = factory.getAll(Interview.Interview);
exports.addFilterInterviewID = factory.addFilter("InterviewID");
exports.addFilterApplicant = factory.addFilter("ApplicantUsername");
exports.addSearchStageDate = factory.addSearch(
  ["Stage", "String"],
  ["Date", "DateRange"]
);
exports.addSortStageDate = factory.addSort();
