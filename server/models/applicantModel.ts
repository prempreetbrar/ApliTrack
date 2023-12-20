const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const Applicant = sequelize.define(
  "APPLICANT",
  {
    Username: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Education: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

// ------------------------------------------------------------------------------------------------------------------

const ApplicantExperience = sequelize.define(
  "APPLICANT_EXPERIENCE",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "actions_unique",
    },
    Experience: {
      type: DataTypes.STRING(32),
      /*
        We make this unique rather than a primary key. This is because
        Sequelize does not allow updating primary keys. Therefore, keeping
        it unique allows it to still "serve" as a primary key, but allows us
        to still update it. 
      */
      allowNull: false,
      unique: "actions_unique",
    },
    ExperienceDesc: {
      type: DataTypes.TEXT,
      comment: "Optional longer description of experience",
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ApplicantUsername", "Experience"],
      },
    },
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantExperience, {
  foreignKey: "ApplicantUsername",
  /*
    When we're doing the join and returning to the frontend, we don't want the applicant prefix.
    Defining an alias avoids that.
  */
  as: "Experiences",
});

// Define the foreign key relationship
ApplicantExperience.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ------------------------------------------------------------------------------------------------------------------

const ApplicantProject = sequelize.define(
  "APPLICANT_PROJECT",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "actions_unique",
    },
    Project: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "actions_unique",
    },
    ProjectDesc: {
      type: DataTypes.TEXT,
      comment: "Optional longer description of project",
    },
  },
  {
    uniqueKeys: {
      actions_unique: {
        fields: ["ApplicantUsername", "Project"],
      },
    },
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantProject, {
  foreignKey: "ApplicantUsername",
  as: "Projects",
});

// Define the foreign key relationship
ApplicantProject.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ------------------------------------------------------------------------------------------------------------------

const ApplicantCertification = sequelize.define(
  "APPLICANT_CERTIFICATION",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Certification: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantCertification, {
  foreignKey: "ApplicantUsername",
  as: "Certifications",
});

// Define the foreign key relationship
ApplicantCertification.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ------------------------------------------------------------------------------------------------------------------

const ApplicantSkill = sequelize.define(
  "APPLICANT_SKILL",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Skill: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantSkill, {
  foreignKey: "ApplicantUsername",
  as: "Skills",
});

// Define the foreign key relationship
ApplicantSkill.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ------------------------------------------------------------------------------------------------------------------

const ApplicantCompetition = sequelize.define(
  "APPLICANT_COMPETITION",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Competition: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantCompetition, {
  foreignKey: "ApplicantUsername",
  as: "Competitions",
});

// Define the foreign key relationship
ApplicantCompetition.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// --------------------------------------------

// definition of many-to-many relationship b/t Applicant and Contact
const ApplicantKnowsContact = sequelize.define(
  "KNOWS",
  {
    Relationship: {
      type: DataTypes.STRING(64),
    },
    Notes: {
      type: DataTypes.TEXT,
    },
    LastContactDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: false,
  }
);

// definition of many-to-many relationship b/t Applicant and Job, for tracking jobs
const ApplicantTracksJob = sequelize.define(
  "TRACKS",
  {
    Notes: {
      type: DataTypes.TEXT,
    },
    DateToApply: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: false,
  }
);

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Applicant = Applicant;
exports.ApplicantExperience = ApplicantExperience;
exports.ApplicantProject = ApplicantProject;
exports.ApplicantCertification = ApplicantCertification;
exports.ApplicantSkill = ApplicantSkill;
exports.ApplicantCompetition = ApplicantCompetition;
exports.ApplicantKnowsContact = ApplicantKnowsContact;
exports.ApplicantTracksJob = ApplicantTracksJob;
//TODO: changes from main creating errors
const { User } = require("./userModel");
const { Contact } = require("./contactModel");
const { Job } = require("./jobModel");

User.hasMany(Applicant, {
  foreignKey: "Username",
});

// Define the foreign key relationship
Applicant.belongsTo(User, {
  as: "User",
  foreignKey: "Username",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Applicant.belongsToMany(Contact, {
  as: "Contacts",
  through: ApplicantKnowsContact,
  foreignKey: "Username",
  otherKey: "ContactID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Contact.belongsToMany(Applicant, {
  as: "Applicants",
  through: ApplicantKnowsContact,
  foreignKey: "ContactID",
  otherKey: "Username",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Applicant.belongsToMany(Job, {
  as: "Jobs",
  through: ApplicantTracksJob,
  foreignKey: "Username",
  otherKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Job.belongsToMany(Applicant, {
  as: "Applicants",
  through: ApplicantTracksJob,
  foreignKey: "PositionID",
  otherKey: "Username",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
