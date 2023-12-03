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
const factory = require("./controllerFactory");
const Applicant = require("../models/applicantModel");
const errorHandling = require("../utils/errorHandling");
exports.createApplicant = factory.createOne(Applicant.Applicant);
exports.createCertification = factory.createOne(Applicant.ApplicantCertification);
exports.createSkill = factory.createOne(Applicant.ApplicantSkill);
exports.createCompetition = factory.createOne(Applicant.ApplicantCompetition);
exports.createProject = factory.createOne(Applicant.ApplicantProject);
exports.updateProject = factory.updateOneWithKey(Applicant.ApplicantProject);
exports.deleteProject = factory.deleteInstance(Applicant.ApplicantProject);
exports.createExperience = factory.createOne(Applicant.ApplicantExperience);
exports.updateEducation = factory.updateInstance(Applicant.Applicant);
exports.updateExperience = factory.updateOneWithKey(Applicant.ApplicantExperience);
exports.getApplicant = factory.getOne(Applicant.Applicant);
exports.deleteApplicant = factory.deleteInstance(Applicant.Applicant);
exports.deleteExperience = factory.deleteInstance(Applicant.ApplicantExperience);
exports.deleteCertification = factory.deleteInstance(Applicant.ApplicantCertification);
exports.deleteSkill = factory.deleteInstance(Applicant.ApplicantSkill);
exports.deleteCompetition = factory.deleteInstance(Applicant.ApplicantCompetition);
/*
  Why aren't we adding this filter in the authController.checkIfLoggedIn function?
  Great question. In the authController.checkIfLoggedIn function, we do
  request.body.user = user, request.body.Username = user.username, and request.body.ApplicantUsername = user.username.

  We have BOTH applicantUsername and username defined, so that if you need one in your controller (either one,
  depending on the name in the relational model), you're able to take it. In other words, you can use
  the username you like and discard the other one.

  However, for a filter, that is not the case. You cannot just have extra columns in a filter; sequelize will
  throw an error. You must add a special filter depending on the model. Wouldn't this impact our ability to create a
  factory function that retrieves a single instance? Well, if we included this logic in factory.getOne, then it would.
  However, by moving it to a SEPARATE middleware function, and then including it BEFORE the exports.getApplicant
  function, we're able to set a custom filter, and then have the custom filter available to the factory function.
  The factory function can then apply the filter without knowing what it actually was.

  THAT is why we invoke next. We say "hey Express, I'm adding this filter. Now, go to the next function after me
  (which we'll make exports.getApplicant in our routes)." The next function will then have access to the filter.
*/
exports.addFilter = errorHandling.catchAsync((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    request.body.filter = {
        Username: request.body.Username,
    };
    next();
}));