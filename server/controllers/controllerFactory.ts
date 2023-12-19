import { Op } from "sequelize";

const multer = require("multer");
const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);

const errorHandling = require("../utils/errorHandling");

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

    console.log( request.body.filter);

    const documents = await Model.findAll({
      where: request.body.filter,
      order: request.body.order,
      include: {
        all: true,
        required: false,
        nested: false,
      },
    });

    //console.log(documents);

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
    console.log("Key Attributes", pkAttributes, uniqueAttributes);
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
  const storage = multer.diskStorage({
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

  return multer({
    storage,
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

exports.addFilter = (...AttributeNames) => {
  return errorHandling.catchAsync(async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    for (const AttributeName of AttributeNames) {
      if (request.body[AttributeName]) {
        request.body.filter[AttributeName] = request.body[AttributeName];
      } else if (request.query[AttributeName]) {
        request.body.filter[AttributeName] = request.query[AttributeName];
      } else if (request.params[AttributeName]) {
        request.body.filter[AttributeName] = request.params[AttributeName];
      }
    }

    next();
  });
};

exports.addSearch = (...AttributeNamesAndTypes) => {
  return errorHandling.catchAsync(async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    if (!request.body.nestedFilter) {
      request.body.nestedFilter = {};
    }

    for (const AttributeNameAndType of AttributeNamesAndTypes) {
      const [Name, Type, Table] = AttributeNameAndType;
      if (Type == "Range") {
        if (
          request.query["Lowest" + Name] &&
          request.query["Highest" + Name] &&
          request.query["Lowest" + Name] !== "" &&
          request.query["Highest" + Name] !== ""
        ) {
          const filter = {
            [Op.between]: [
              request.query["Lowest" + Name],
              request.query["Highest" + Name],
            ],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        } else if (
          request.query["Lowest" + Name] &&
          request.query["Lowest" + Name] !== ""
        ) {
          const filter = {
            [Op.gte]: request.query["Lowest" + Name],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        } else if (
          request.query["Highest" + Name] &&
          request.query["Highest" + Name] !== ""
        ) {
          const filter = {
            [Op.lte]: request.query["Highest" + Name],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        }
      }

      if (Type == "DateRange") {
        if (
          request.query["Earliest" + Name] &&
          request.query["Latest" + Name] &&
          request.query["Earliest" + Name] !== "" &&
          request.query["Latest" + Name] !== ""
        ) {
          const filter = {
            [Op.between]: [
              request.query["Earliest" + Name],
              request.query["Latest" + Name],
            ],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        } else if (
          request.query["Earliest" + Name] &&
          request.query["Earliest" + Name] !== ""
        ) {
          const filter = {
            [Op.gte]: request.query["Earliest" + Name],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        } else if (
          request.query["Latest" + Name] &&
          request.query["Latest" + Name] !== ""
        ) {
          const filter = {
            [Op.lte]: request.query["Latest" + Name],
          };
          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        }
      }

      if (Type === "String") {
        if (request.body[Name] || request.query[Name]) {
          const filter = {
            [Op.like]: `%${request.body[Name] || request.query[Name]}%`,
          };

          if (Table === "Nested") {
            request.body.nestedFilter[Name] = { ...filter };
          } else {
            request.body.filter[Name] = {
              ...filter,
            };
          }
        }
      }

      if (Type === "Array") {
        // if (request.body[Name] || request.query[Name]) {
        //   const categoryValue = [
        //     request.body.Category || request.query.Category,
        //   ];
        //   request.body.filter[Name] = {
        //     where: {
        //       Category: { [Op.in]: categoryValue },
        //     },
        //   };
        // }

        if (request.body[Name] || request.query[Name]) {
          const categoryValue = Array.isArray(request.body[Name] || request.query[Name])
            ? request.body[Name] || request.query[Name]
            : [request.body[Name] || request.query[Name]];
      
            console.log("TESTING LOG");
            console.log(categoryValue);

            //TODO: How can I link this back to application table with ID?
          request.body.filter[Name] = {
            // where: {
            //   Category: { [Op.in]: categoryValue },
            // },

            [Op.in]: categoryValue,
          };

          console.log(request.body.filter);
        }
      }
    }

    next();
  });
};

exports.addMultivalueSearch = (multiValueModel, ...AttributeNamesAndTypes: any[]) => {
  return errorHandling.catchAsync(async (request, response, next) => {
    if (!request.body.filter) {
      request.body.filter = {};
    }

    for (const AttributeNameAndType of AttributeNamesAndTypes) {
      const [Name, Type] = AttributeNameAndType;
      if (Type == "Range") {
        if (
          request.query["Lowest" + Name] &&
          request.query["Highest" + Name] &&
          request.query["Lowest" + Name] !== "" &&
          request.query["Highest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.between]: [
              request.query["Lowest" + Name],
              request.query["Highest" + Name],
            ],
          };
        } else if (
          request.query["Lowest" + Name] &&
          request.query["Lowest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.gte]: request.query["Lowest" + Name],
          };
        } else if (
          request.query["Highest" + Name] &&
          request.query["Highest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.lte]: request.query["Highest" + Name],
          };
        }
      }

      if (Type == "DateRange") {
        if (
          request.query["Earliest" + Name] &&
          request.query["Latest" + Name] &&
          request.query["Earliest" + Name] !== "" &&
          request.query["Latest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.between]: [
              request.query["Earliest" + Name],
              request.query["Latest" + Name],
            ],
          };
        } else if (
          request.query["Earliest" + Name] &&
          request.query["Earliest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.gte]: request.query["Earliest" + Name],
          };
        } else if (
          request.query["Latest" + Name] &&
          request.query["Latest" + Name] !== ""
        ) {
          request.body.filter[Name] = {
            [Op.lte]: request.query["Latest" + Name],
          };
        }
      }

      if (Type === "String") {
        if (request.body[Name] || request.query[Name]) {
          request.body.filter[Name] = {
            [Op.like]: `%${request.body[Name] || request.query[Name]}%`,
          };
        }
      }

      if (Type === "Array") {
        // if (request.body[Name] || request.query[Name]) {
        //   const categoryValue = [
        //     request.body.Category || request.query.Category,
        //   ];
        //   request.body.filter[Name] = {
        //     where: {
        //       Category: { [Op.in]: categoryValue },
        //     },
        //   };
        // }

        if (request.body[Name] || request.query[Name]) {
          const categoryValue = Array.isArray(request.body[Name] || request.query[Name])
            ? request.body[Name] || request.query[Name]
            : [request.body[Name] || request.query[Name]];
      
            console.log("TESTING LOG");
            console.log(categoryValue);

            //TODO: How can I link this back to application table with ID?
          request.body.filter[Name] = {
            // where: {
            //   Category: { [Op.in]: categoryValue },
            // },

            [Op.in]: categoryValue,
          };

          console.log(request.body.filter);
        }
      }
    }

    next();
  });
};

exports.addSort = () => {
  return errorHandling.catchAsync(async (request, response, next) => {
    if (!request.body.order) {
      request.body.order = [];
    }
    if (!request.body.nestedOrder) {
      request.body.nestedOrder = [];
    }

    if (request.query.Sort) {
      const allSorts = request.query.Sort.split(",");
      for (const sort of allSorts) {
        request.body.order.push(sort.split("-"));
      }
    }

    if (request.query.SortNested) {
      const allSorts = request.query.SortNested.split(",");
      for (const sort of allSorts) {
        request.body.nestedOrder.push(sort.split("-"));
      }
    }

    next();
  });
};
