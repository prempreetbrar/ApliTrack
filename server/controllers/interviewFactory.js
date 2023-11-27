const errorHandling = require("../utils/errorHandling");

exports.deleteOneInterview = (Model) => {
    return errorHandling.catchAsync(async (request, response) => {
      const keyObj = request.body["InterviewID"];
      
      await Model.destroy({
        where: {
            "InterviewID": keyObj
        }
      });
  
      response.status(201).json({
        status: "success",
      });
    });
  }