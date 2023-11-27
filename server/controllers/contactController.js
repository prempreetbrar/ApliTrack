const factory = require("./controllerFactory");
const Contact = require("../models/contactModel");
const errorHandling = require("../utils/errorHandling");

exports.createContact = factory.createOne(Contact.Contact);
exports.createContactEmail = factory.createOne(Contact.ContactEmail);
exports.createContactPhone = factory.createOne(Contact.ContactPhone);

exports.deleteContact = () => {
    return errorHandling.catchAsync(async (request, response) => {
      const document = await Contact.Contact.destroy({where: {ContactID: request.body.ContactID}});
      response.status(201).json({
        status: "success",
        data: {
          [Model.TableName]: document,
        },
      });
    });
  };