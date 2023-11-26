const errorHandling = require("../utils/errorHandling");

exports.createOne = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    const document = await Model.create(request.body);
    response.status(201).json({
      status: "success",
      data: {
        [Model.TableName]: document,
      },
    });
  });
};
