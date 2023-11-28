const errorHandling = require("../utils/errorHandling");

exports.deleteOneInterview = (Model) => {
    return errorHandling.catchAsync(async (request, response) => {
      const interviewPK = request.body["InterviewID"];
      const applicantPK = request.body["ApplicantUsername"];
      
      await Model.destroy({
        where: {
            "InterviewID": interviewPK,
            "ApplicantUsername": applicantPK
        }
      });
  
      response.status(201).json({
        status: "success",
      });
    });
  };
