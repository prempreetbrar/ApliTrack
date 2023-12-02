const factory = require("./controllerFactory");
const Job = require("../models/jobModel");

exports.createJob = factory.createOne(Job.Job);
exports.createJobQual = factory.createOne(Job.JobQualification);
exports.createJobResp = factory.createOne(Job.JobResponsibility);

exports.deleteJob = factory.deleteInstance(Job.Job);
exports.deleteJobQual = factory.deleteInstance(Job.JobQualification);
exports.deleteJobResp = factory.deleteInstance(Job.JobResponsibility);

exports.updateJob = factory.updateInstance(Job.Job);

// for many-to-many relationship(s)
exports.createJobMentionsInterview = factory.createOne(Job.JobMentionsInterview);
exports.deleteJobMentionsInterview = factory.deleteInstance(Job.JobMentionsInterview);