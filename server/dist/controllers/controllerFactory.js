"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const document = yield Model.create(request.body);
        response.status(201).json({
            status: "success",
            data: {
                [Model.name.toLowerCase()]: document,
            },
        });
    }));
};
/*
  Add the filter using ANOTHER middleware function. See how applicant
  adds its filter for getApplicant for more details.
*/
exports.getOne = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const document = yield Model.findOne({
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
    }));
};
exports.getAll = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const cleanedQuery = new APIFeatures(request.query, Model.findAll({
            where: request.body.filter,
            include: {
                all: true,
                required: false,
                nested: false,
            },
        }))
            .filter()
            .sort()
            .project()
            .paginate();
        const instances = yield cleanedQuery.dbQuery;
        response.status(200).json({
            status: "success",
            //   page: cleanedQuery.pageNumber,
            results: instances.length,
            data: {
                [Model.name.toLowerCase()]: instances,
            },
        });
    }));
};
exports.updateInstance = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        //get a list of the model's primary key attributes
        console.log("BODY:", request.body, "\n");
        const pkAttributes = Model.primaryKeyAttributes;
        //get the keys and the new values of the request
        const keys = {};
        const newValues = {};
        for (let x in request.body) {
            if (pkAttributes.includes(x)) {
                keys[x] = request.body[x];
            }
            else {
                newValues[x] = request.body[x];
            }
        }
        //debug output
        console.log("KEYS:", keys, "\n");
        console.log("NEW VALUES:", newValues, "\n");
        //find the instance
        const instance = yield Model.findOne({
            where: keys,
        });
        //update the instance
        yield instance.update(newValues);
        // response code 200 (since 201 is for creation but we aren't creating here, we're updating)
        response.status(200).json({
            status: "success",
            data: {
                [Model.name.toLowerCase()]: instance,
            },
        });
        console.log(instance.toJSON());
    }));
};
exports.deleteInstance = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        //get a list of the model's primary key attributes
        const pkAttributes = Model.primaryKeyAttributes;
        //get the keys and the new values of the request
        var keys = {};
        for (let x in request.body) {
            var obj = { [x]: request.body[x] };
            if (pkAttributes.includes(x)) {
                Object.assign(keys, obj);
            }
        }
        //debug output
        console.log("KEYS:");
        console.log(keys);
        //delete the instance
        yield Model.destroy({
            where: keys,
        });
        response.status(201).json({
            status: "success",
        });
    }));
};
exports.updateOneWithKey = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
            if ((pkAttributes.includes(x) || uniqueAttributes.includes(x)) &&
                !request.params.hasOwnProperty(x)) {
                keys[x] = request.body[x];
                /*
                If it IS a key, then we must store two things. We must store the
                URL parameter as the key we will search by, and then store the
                request body value into our new values (that we will update by).
              */
            }
            else if (request.params.hasOwnProperty(x)) {
                keys[x] = request.params[x];
                newValues[x] = request.body[x];
            }
            else {
                newValues[x] = request.body[x];
            }
        }
        //debug output
        console.log("KEYS:", keys, "\n");
        console.log("NEW VALUES:", newValues, "\n");
        const instance = yield Model.findOne({
            where: keys,
        });
        //update the instance
        console.log("LOGGING INSTANCE", instance, "\n");
        yield instance.update(newValues);
        console.log("NEW INSTANCE", instance, "\n");
        // response code 200 (since 201 is for creation but we aren't creating here, we're updating)
        response.status(200).json({
            status: "success",
            data: {
                [Model.name.toLowerCase()]: instance,
            },
        });
    }));
};
exports.deleteInstance = (Model) => {
    return errorHandling.catchAsync((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        //get a list of the model's primary key attributes
        const pkAttributes = Model.primaryKeyAttributes;
        //get the keys and the new values of the request
        var keys = {};
        console.log(request.body);
        for (let x in request.body) {
            var obj = { [x]: request.body[x] };
            if (pkAttributes.includes(x)) {
                Object.assign(keys, obj);
            }
        }
        //debug output
        console.log("KEYS:", keys, "\n");
        //delete the instance
        yield Model.destroy({
            where: keys,
        });
        response.status(204).json({
            status: "success",
        });
    }));
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
