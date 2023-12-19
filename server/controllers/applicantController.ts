const factory = require("./controllerFactory");
const Applicant = require("../models/applicantModel");

exports.createApplicant = factory.createOne(Applicant.Applicant);
exports.createCertification = factory.createOne(
  Applicant.ApplicantCertification
);
exports.createSkill = factory.createOne(Applicant.ApplicantSkill);
exports.createCompetition = factory.createOne(Applicant.ApplicantCompetition);
exports.createProject = factory.createOne(Applicant.ApplicantProject);
exports.updateProject = factory.updateOneWithKey(Applicant.ApplicantProject);
exports.deleteProject = factory.deleteInstance(Applicant.ApplicantProject);
exports.createExperience = factory.createOne(Applicant.ApplicantExperience);
exports.updateEducation = factory.updateInstance(Applicant.Applicant);
exports.updateExperience = factory.updateOneWithKey(
  Applicant.ApplicantExperience
);
exports.getApplicant = factory.getOne(Applicant.Applicant);
exports.deleteApplicant = factory.deleteInstance(Applicant.Applicant);
exports.deleteExperience = factory.deleteInstance(
  Applicant.ApplicantExperience
);
exports.deleteCertification = factory.deleteInstance(
  Applicant.ApplicantCertification
);
exports.deleteSkill = factory.deleteInstance(Applicant.ApplicantSkill);
exports.deleteCompetition = factory.deleteInstance(
  Applicant.ApplicantCompetition
);

// for many-to-many relationships
exports.getApplicantKnowsContact = factory.getAll(
  Applicant.ApplicantKnowsContact
);
exports.createApplicantKnowsContact = factory.createOne(
  Applicant.ApplicantKnowsContact
);
exports.deleteApplicantKnowsContact = factory.deleteInstance(
  Applicant.ApplicantKnowsContact
);
exports.updateApplicantKnowsContact = factory.updateOneWithKey(
  Applicant.ApplicantKnowsContact
);

exports.getApplicantTracksJob = factory.getAll(Applicant.ApplicantTracksJob);
exports.createApplicantTracksJob = factory.createOne(
  Applicant.ApplicantTracksJob
);
exports.deleteApplicantTracksJob = factory.deleteInstance(
  Applicant.ApplicantTracksJob
);
exports.updateApplicantTracksJob = factory.updateInstance(
  Applicant.ApplicantTracksJob
);

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
exports.addFilterUsername = factory.addFilter("Username");
exports.addSearchDateToApply = factory.addSearch(["DateToApply", "DateRange"]);
