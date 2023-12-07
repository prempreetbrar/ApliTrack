const factory = require("./controllerFactory");
const Job = require("../models/jobModel");
const errorHandling = require("../utils/errorHandling");

exports.createJob = factory.createOne(Job.Job);
exports.createJobQual = factory.createOne(Job.JobQualification);
exports.createJobResp = factory.createOne(Job.JobResponsibility);

exports.deleteJob = factory.deleteInstance(Job.Job);
exports.deleteJobQual = factory.deleteInstance(Job.JobQualification);
exports.deleteJobResp = factory.deleteInstance(Job.JobResponsibility);

exports.updateJob = factory.updateInstance(Job.Job);

exports.getJob = factory.getOne(Job.Job);
exports.getAllJobs = factory.getAll(Job.Job);
exports.getAllCompanyJobs = factory.getAll(Job.Job);

exports.addFilterID = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        PositionID: request.body.PositionID,
      };
      next();
    }
  );

  exports.addFilterCompany = errorHandling.catchAsync(
    async (request, response, next) => {
      request.body.filter = {
        CompName: request.body.CompName,
      };
      next();
    }
  );