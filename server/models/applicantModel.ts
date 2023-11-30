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
  as: "User",
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

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync({ alter: true });
exports.Applicant = Applicant;
exports.ApplicantExperience = ApplicantExperience;
exports.ApplicantProject = ApplicantProject;
exports.ApplicantCertification = ApplicantCertification;
exports.ApplicantSkill = ApplicantSkill;
exports.ApplicantCompetition = ApplicantCompetition;
