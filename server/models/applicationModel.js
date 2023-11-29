const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");

const Application = sequelize.define(
  "APPLICATION",
  {
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    AName: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
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
    timestamps: false,
  }
);

//Applicant has a one-to-many relationship with Application
Applicant.hasMany(Application, {
    foreignKey: "ApplicantUsername",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Application.belongsTo(Applicant, {
    foreignKey: "ApplicantUsername",
});

const Appl_Relevant_URL = sequelize.define(
    "APPL_RELEVANT_URL",
    {
      ApplicantUsername: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
      },
      AName: {
        type: DataTypes.STRING(32),
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
    foreignKey: 'AName',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Appl_Relevant_URL.belongsTo(Application, {
    foreignKey: "AName",
});
// Appl_Relevant_URL.belongsTo(Applicant, {
//     foreignKey: 'ApplicantUsername',
// });

const Appl_Category = sequelize.define(
    "APPL_CATEGORY",
    {
      ApplicantUsername: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
      },
      AName: {
        type: DataTypes.STRING(32),
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
    foreignKey: 'AName',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Appl_Category.belongsTo(Application, {
    foreignKey: "AName",
});
// Appl_Category.belongsTo(Applicant, {
//     foreignKey: 'ApplicantUsername',
// });

//TODO: later
//Application has a many-to-many relationship with Document

sequelize.sync();
exports.Application = Application;
exports.Appl_Relevant_URL = Appl_Relevant_URL;
exports.Appl_Category = Appl_Category;
