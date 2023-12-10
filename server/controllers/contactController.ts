const { Op } = require("sequelize");
const factory = require("./controllerFactory");
const Contact = require("../models/contactModel");
const errorHandling = require("../utils/errorHandling");

exports.createContact = factory.createOne(Contact.Contact);
exports.createContactEmail = factory.createOne(Contact.ContactEmail);
exports.createContactPhone = factory.createOne(Contact.ContactPhone);

exports.getContact = factory.getOne(Contact.Contact);
exports.getAllContacts = factory.getAll(Contact.Contact);

exports.deleteContact = factory.deleteInstance(Contact.Contact);
exports.deleteContactPhone = factory.deleteInstance(Contact.ContactPhone);
exports.deleteContactEmail = factory.deleteInstance(Contact.ContactEmail);

exports.updateContact = factory.updateInstance(Contact.Contact);

// for many-to-many relationship(s)
exports.createContactWorksAtCompany = factory.createOne(
  Contact.ContactWorksAtCompany
);
exports.deleteContactWorksAtCompany = factory.deleteInstance(
  Contact.ContactWorksAtCompany
);
exports.updateContactWorksAtCompany = factory.updateInstance(
  Contact.ContactWorksAtCompany
);

//TODO: CHECK
exports.createContactAttendsInterview = factory.createOne(Contact.ContactAttendsInterview);
exports.deleteContactAttendsInterview = factory.deleteInstance(Contact.ContactAttendsInterview);

exports.addFilter = errorHandling.catchAsync(
  async (request, response, next) => {
    request.body.filter = {};
    if (request.body.ContactID || request.query.ContactID) {
      request.body.filter.ContactID =
        request.body.ContactID || request.query.ContactID;
    }
    if (request.body.Fname || request.query.Fname) {
      request.body.filter.Fname = {
        [Op.like]: `%${request.body.Fname || request.query.Fname}%`,
      };
    }
    if (request.body.Lname || request.query.Lname) {
      request.body.filter.Lname = {
        [Op.like]: `%${request.body.Lname || request.query.Lname}%`,
      };
    }
    if (
      request.query.EarliestLastContactDate &&
      request.query.LatestLastContactDate &&
      request.query.EarliestLastContactDate !== "MM/DD/YYYY" &&
      request.query.LatestLastContactDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.LastContactDate = {
        [Op.between]: [
          request.query.EarliestLastContactDate,
          request.query.LatestLastContactDate,
        ],
      };
    } else if (
      request.query.EarliestLastContactDate &&
      request.query.EarliestLastContactDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.LastContactDate = {
        [Op.gte]: request.query.EarliestLastContactDate,
      };
    } else if (
      request.query.LatestLastContactDate &&
      request.query.LatestLastContactDate !== "MM/DD/YYYY"
    ) {
      request.body.filter.LastContactDate = {
        [Op.lte]: request.query.LatestLastContactDate,
      };
    }

    next();
  }
);
