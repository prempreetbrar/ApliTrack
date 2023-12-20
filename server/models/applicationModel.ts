const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");
const { Document } = require("./documentModel");

//TODO: changes from main creating errors
const { Job } = require("./jobModel");

const Application = sequelize.define(
  "APPLICATION",
  {
    ApplicationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "uniqueTag",
    },
    AName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "uniqueTag",
    },
    Notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    DateSubmitted: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
  },
  {
    initialAutoIncrement: 1,
    timestamps: false,
  }
);

//Applicant has a one-to-many relationship with Application
Applicant.hasMany(Application, {
  as: "Applications",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Application.belongsTo(Applicant, {
  as: "Applicant",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

const Appl_Relevant_URL = sequelize.define(
  "APPL_RELEVANT_URL",
  {
    ApplicationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    RelevantURL: {
      type: DataTypes.STRING(512),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

//appl_relevant_URL is a multi-value attribute of application
Application.hasMany(Appl_Relevant_URL, {
  as: "RelevantURL",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Appl_Relevant_URL.belongsTo(Application, {
  as: "Application",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Appl_Relevant_URL.belongsTo(Applicant, {
//     foreignKey: 'ApplicantUsername',
// });

const Appl_Category = sequelize.define(
  "APPL_CATEGORY",
  {
    ApplicationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

//appl_category is a multivalue attribute of application
Application.hasMany(Appl_Category, {
  as: "Category",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Appl_Category.belongsTo(Application, {
  as: "Application",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//TODO: changes from main creating errors
// definition of many-to-many relationship b/t Application and Job
const ApplicationCorrespondsToJob = sequelize.define(
  "CORRESPONDS_TO",
  {
    ApplicationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Application,
        key: "ApplicationID",
      },
    },
    PositionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Job,
        key: "PositionID",
      },
    },
    JobPostURL: {
      type: DataTypes.STRING(128),
    },
  },
  {
    timestamps: false,
  }
);
Application.belongsToMany(Job, {
  as: "Jobs",
  through: ApplicationCorrespondsToJob,
  foreignKey: "ApplicationID",
  otherKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Job.belongsToMany(Application, {
  as: "Applications",
  through: ApplicationCorrespondsToJob,
  foreignKey: "PositionID",
  otherKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Application has a many-to-many relationship with Document
const ApplicationSubmitWithDoc = sequelize.define(
  "SUBMIT_WITH",
  {
    ApplicationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Application,
        key: "ApplicationID",
      },
    },
    DocumentID: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
      references: {
        model: Document,
        key: "DocumentID",
      },
    },
  },
  {
    timestamps: false,
  }
);

Document.belongsToMany(Application, {
  as: "Applications",
  through: ApplicationSubmitWithDoc,
  foreignKey: "DocumentID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Application.belongsToMany(Document, {
  as: "Documents",
  through: ApplicationSubmitWithDoc,
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize.sync();
exports.Application = Application;
exports.Appl_Relevant_URL = Appl_Relevant_URL;
exports.Appl_Category = Appl_Category;
exports.ApplicationSubmitWithDoc = ApplicationSubmitWithDoc;

//TODO: changes from main creating errors
exports.ApplicationCorrespondsToJob = ApplicationCorrespondsToJob;
