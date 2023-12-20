const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");

const Interview = sequelize.define(
  "INTERVIEW",
  {
    InterviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      //primaryKey: true,
      allowNull: false,
    },
    Stage: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    Date: {
      type: DataTypes.TEXT, //change maybde to date only
      allowNull: false,
    },
    ApplicationID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    initialAutoIncrement: 1,
    timestamps: false,
  }
);

sequelize.sync();
exports.Interview = Interview;

const { Applicant } = require("./applicantModel");
const { Application } = require("./applicationModel");

//Applicant has a one-to-many relationship with Interview
Applicant.hasMany(Interview, {
  as: "Interviews",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Interview.belongsTo(Applicant, {
  as: "Applicant",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Application has a one-to-many relationship with Interview
Application.hasMany(Interview, {
  as: "Interviews",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Interview.belongsTo(Application, {
  as: "Application",
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
