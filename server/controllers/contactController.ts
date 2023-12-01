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
