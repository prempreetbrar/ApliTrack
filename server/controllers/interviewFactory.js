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

  // exports.deleteInstance = (Model) => {
  //   return errorHandling.catchAsync(async (request, response) => {
  //     //get a list of the model's primary key attributes
  //     const pkAttributes = Model.primaryKeyAttributes;
  
  //     //get the keys and the new values of the request
  //     var keys = {};
  //     for(let x in request.body) {
  //       var obj = {[x]: request.body[x]};
  
  //       if(pkAttributes.includes(x)) {
  //         Object.assign(keys, obj);
  //       }
  //     }
  
  //     //debug output
  //     console.log("KEYS:");
  //     console.log(keys);
  
  //     //delete the instance
  //     await Model.destroy({
  //       where: keys
  //     });
  
  //     response.status(201).json({
  //       status: "success",
  //     });
  //   });
  // };