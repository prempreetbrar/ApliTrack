const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");

const Interview = sequelize.define(
  "INTERVIEW",
  {
    InterviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      //autoIncrement: true,
      defaultValue: 0,
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

// Implementing a beforeCreate hook to manually increment the InterviewID
Interview.beforeCreate(async (instance, options) => {
  try {
    const maxInterviewID = await Interview.max("InterviewID", {
      //where: { ApplicantUsername: instance.ApplicantUsername },
    });

    instance.InterviewID = maxInterviewID ? maxInterviewID + 1 : 1;
  } catch (error) {
    // Handle any potential errors
    console.error("Error during beforeCreate hook:", error);
  }
});

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
