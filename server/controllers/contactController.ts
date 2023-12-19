const factory = require("./controllerFactory");
const Contact = require("../models/contactModel");

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
exports.createContactAttendsInterview = factory.createOne(
  Contact.ContactAttendsInterview
);
exports.deleteContactAttendsInterview = factory.deleteInstance(
  Contact.ContactAttendsInterview
);

exports.addSort = factory.addSort();
exports.addFilterContactID = factory.addFilter("ContactID");
exports.addSearchNameContactDate = factory.addSearch(
  ["Fname", "String"],
  ["Lname", "String"],
  ["LastContactDate", "DateRange"]
);
