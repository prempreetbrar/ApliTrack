const fs = require("fs");
const path = require("path");
const factory = require("./controllerFactory");
const Job = require("../models/jobModel");
const errorHandling = require("../utils/errorHandling");

exports.createJob = factory.createOne(Job.Job);
exports.createJobQual = factory.createOne(Job.JobQualification);
exports.createJobResp = factory.createOne(Job.JobResponsibility);
exports.uploadJobPostFile = errorHandling.catchAsync(
  async (request, response, next) => {
    // Check if a file was uploaded
    if (!request.file) {
      next();
      return;
    }

    // Write the file to the upload directory
    // Resolve the absolute path to the uploads directory
    const uploadsPath = path.resolve(__dirname, "../uploads/jobPosts");

    // Ensure the directory exists, create it if not
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    // Construct the file path
    const fileName = `${request.file.originalname}`;
    const filePath = path.join(uploadsPath, fileName);

    const readStream = fs.createReadStream(request.file.path);
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("File written successfully");
      fs.unlinkSync(request.file.path);
    });

    request.body.JobPostFile = filePath;
    next();
  }
);

// for many-to-many relationship(s)
exports.createJobMentionsInterview = factory.createOne(Job.JobMentionsInterview);
exports.deleteJobMentionsInterview = factory.deleteInstance(Job.JobMentionsInterview);

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
      PositionID: request.body.PositionID || request.params.PositionID,
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
