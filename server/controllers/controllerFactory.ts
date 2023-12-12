const path = require("path");
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);

const errorHandling = require("../utils/errorHandling");
const APIFeatures = require("../utils/apiFeatures");

/*
  We realize that a lot of the time, creation involves
  simply sending a create request to the database (with the
  request body). Rather than duplicating this across every
  controller, we simply abstract it to a factory function that
  takes in a model. This way, you can create several controller functions
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

exports.getAll = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }
    if (!request.body.order) {
      request.body.order = [];
    }

    const documents = await Model.findAll({
      where: request.body.filter,
      order: request.body.order,
      include: {
        all: true,
        required: false,
        nested: false,
      },
    });

    // console.log("\nAll results", documents, "\n");

    response.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: documents,
      },
    });
  });
};

exports.updateInstance = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    //get a list of the model's primary key attributes
    console.log("BODY:", request.body, "\n");
    const pkAttributes = Model.primaryKeyAttributes;

    //get the keys and the new values of the request
    const keys = {};
    const newValues = {};

    for (let x in request.body) {
      if (pkAttributes.includes(x)) {
        keys[x] = request.body[x];
      } else {
        newValues[x] = request.body[x];
      }
    }

    //debug output
    console.log("KEYS:", keys, "\n");

    console.log("NEW VALUES:", newValues, "\n");

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
        [Model.name.toLowerCase()]: instance,
      },
    });

    console.log(instance.toJSON());
  });
};

exports.updateOneWithKey = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    /*
      If we are updating the key of a model (usually when it's a 
      composite key where we're updating one of the attributes,
      such as for a multivalued attribute table), we run into a
      problem if we only use the request body. This is because the
      request body contains the NEW key value, making it IMPOSSIBLE
      for us to search by the OLD key. To solve this, we pass in a variable
      into the URL. We first filter using this variable, and THEN
      update the object using the new values.
    */
    const pkAttributes = Model.primaryKeyAttributes;
    const uniqueAttributes = getUniqueAttributes(Model);
    console.log("Key Attribtues", pkAttributes, uniqueAttributes);
    console.log("Body and Params", request.body, request.params);

    const keys = {};
    const newValues = {};
    for (let x in request.body) {
      /*
        If the request body has the NEW key, then we've structured the
        route in such a way that the URL parameters ALSO have the same
        name. For example, for applicant experiences, we have
        /experiences/:Experience. Therefore, if we pass in an experience
        in the request body, we can easily check if it is in the URL params.

        If it is, that means we do NOT want to search by it. Instead,
        we want to put it into the newValues object. 
      */
      if (
        (pkAttributes.includes(x) || uniqueAttributes.includes(x)) &&
        !request.params.hasOwnProperty(x)
      ) {
        keys[x] = request.body[x];

        /*
        If it IS a key, then we must store two things. We must store the
        URL parameter as the key we will search by, and then store the
        request body value into our new values (that we will update by).
      */
      } else if (request.params.hasOwnProperty(x)) {
        keys[x] = request.params[x];
        newValues[x] = request.body[x];
      } else {
        newValues[x] = request.body[x];
      }
    }

    //debug output
    console.log("KEYS:", keys, "\n");
    console.log("NEW VALUES:", newValues, "\n");

    const instance = await Model.findOne({
      where: keys,
    });

    //update the instance
    console.log("LOGGING INSTANCE", instance, "\n");
    await instance.update(newValues);
    console.log("NEW INSTANCE", instance, "\n");

    // response code 200 (since 201 is for creation but we aren't creating here, we're updating)
    response.status(200).json({
      status: "success",
      data: {
        [Model.name.toLowerCase()]: instance,
      },
    });
  });
};

exports.deleteInstance = (Model) => {
  return errorHandling.catchAsync(async (request, response) => {
    //get a list of the model's primary key attributes
    const pkAttributes = Model.primaryKeyAttributes;
    const uniqueAttributes = getUniqueAttributes(Model);

    //get the keys and the new values of the request
    var keys = {};
    console.log("\nRequest body for deletion!", request.body, "\n");
    for (let x in request.body) {
      var obj = { [x]: request.body[x] };

      if (pkAttributes.includes(x) || uniqueAttributes.includes(x)) {
        Object.assign(keys, obj);
      }
    }

    //debug output
    console.log("KEYS:", keys, "\n");

    //delete the instance
    await Model.destroy({
      where: keys,
    });

    response.status(204).json({
      status: "success",
    });
  });
};

function getUniqueAttributes(Model) {
  const uniqueAttributes = [];

  Object.keys(Model.rawAttributes).forEach((attribute) => {
    const uniqueConstraint = Model.rawAttributes[attribute].unique;
    if (uniqueConstraint) {
      uniqueAttributes.push(attribute);
    }
  });

  return uniqueAttributes;
}

exports.uploadStorage = (destination) => {
  return multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
      fs.readdir(destination, (err, files) => {
        const fileName =
          file.originalname.split(".")[0] +
          " - [" +
          (files.length + 1) +
          "]." +
          file.originalname.split(".")[1];
        cb(null, fileName);
      });
    },
  });
};

exports.uploadFile = (directoryWhereFilesStored, nameOfFileColumn) => {
  const controllerFunction = errorHandling.catchAsync(
    async (request, response, next) => {
      // Check if a file was uploaded
      if (!request.file) {
        next();
        return;
      }

      let fileName = request.file.originalname;
      // // Read files asynchronously using Promise
      const files = await readdir(directoryWhereFilesStored);

      if (files) {
        // Update fileName with the special name
        fileName =
          fileName.split(".")[0] +
          " - [" +
          files.length +
          "]." +
          fileName.split(".")[1];
      }

      request.body[nameOfFileColumn] = fileName;
      next();
    }
  );
  return controllerFunction;
};
