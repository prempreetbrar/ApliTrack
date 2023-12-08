const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");
const { Application } = require("./applicationModel");

const Interview = sequelize.define(
  "INTERVIEW",
  {
    InterviewID: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true,
      allowNull: false,
      defaultValue: 0,
    },
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      primaryKey: true,
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
    timestamps: false,
  }
);

//Applicant has a one-to-many relationship with Interview
Applicant.hasMany(Interview, {
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Interview.belongsTo(Applicant, {
  foreignKey: "ApplicantUsername",
});

//Application has a one-to-many relationship with Interview
Application.hasMany(Interview, {
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Interview.belongsTo(Application, {
  foreignKey: "ApplicationID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Implementing a beforeCreate hook to manually increment the InterviewID
Interview.beforeCreate(async (instance, options) => {
  try {
    const maxInterviewID = await Interview.max("InterviewID", {
      where: { ApplicantUsername: instance.ApplicantUsername },
    });

    instance.InterviewID = maxInterviewID ? maxInterviewID + 1 : 1;
  } catch (error) {
    // Handle any potential errors
    console.error("Error during beforeCreate hook:", error);
  }
});

sequelize.sync();
exports.Interview = Interview;
