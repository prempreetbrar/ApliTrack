const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const User = require("./userModel");

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

User.hasMany(Applicant, {
  foreignKey: "Username",
});

// Define the foreign key relationship
Applicant.belongsTo(User, {
  foreignKey: "Username",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ------------------------------------------------------------------------------------------------------------------

const ApplicantExperience = sequelize.define(
  "APPLICANT_EXPERIENCE",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Experience: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    ExperienceDesc: {
      type: DataTypes.TEXT,
      comment: "Optional longer description of experience",
    },
  },
  {
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantExperience, {
  foreignKey: "ApplicantUsername",
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
      primaryKey: true,
      allowNull: false,
    },
    Project: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    ProjectDesc: {
      type: DataTypes.TEXT,
      comment: "Optional longer description of project",
    },
  },
  {
    timestamps: false,
  }
);

Applicant.hasMany(ApplicantProject, {
  foreignKey: "ApplicantUsername",
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
});

// Define the foreign key relationship
ApplicantCompetition.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

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
