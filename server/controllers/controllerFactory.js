const errorHandling = require("../utils/errorHandling");

/*
  We realize that a lot of the time, creation involves
  simply sending a create request to the database (with the
  request body). Rather than duplicating this across every
  controller, we simply abstract it to a factory function that
  takes in a model. This way, you can create several models
  with a single line.

  If custom logic is needed for creation, we would either
  NOT use this factory function (and instead define our own),
  or register another middleware function BEFORE this one (which
  performs the additional logic).
*/
exports.createOne = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    const document = await Model.create(request.body);
    response.status(201).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: document,
      },
    });
  });
};

/*
  Add the filter using ANOTHER middleware function. See how applicant
  adds its filter for getApplicant for more details.
*/
exports.getOne = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    const document = await Model.findOne({
      where: request.body.filter,
      include: {
        all: true,
        required: false,
        nested: false,
      },
    });

    response.status(201).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: document,
      },
    });
  });
};

exports.updateInstance = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    //get a list of the model's primary key attributes
    const pkAttributes = Model.primaryKeyAttributes;

    //get the keys and the new values of the request
    var keys = {};
    var newValues = {};
    for (let x in request.body) {
      var obj = { [x]: request.body[x] };

      if (pkAttributes.includes(x)) {
        Object.assign(keys, obj);
      } else {
        Object.assign(newValues, obj);
      }
    }

    //debug output
    console.log("KEYS:");
    console.log(keys);

    console.log("NEW VALUES:");
    console.log(newValues);

    //find the instance
    const instance = await Model.findOne({
      where: keys,
    });

    //update the instance
    await instance.update(newValues);

    // response code 200 (since 201 is for creation but we aren't creating here, we're updating)
    response.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: document,
      },
    });
  });
};
