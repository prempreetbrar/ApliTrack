const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");

const Interview = sequelize.define(
    "INTERVIEW",
    {
      InterviewID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ApplicantUsername: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      Stage: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      DateTime: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    //   ApplicationName: {
    //     type: DataTypes.STRING(32),
    //     allowNull: false,
    //   },
    },
    {
      timestamps: false,
    }
  );

  Applicant.hasMany(Interview, {
    foreignKey: 'ApplicantUsername',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  //TODO: add this schema later
//   APPLICATION.hasMany(INTERVIEW, {
//     foreignKey: 'ApplicationName',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   });

  sequelize.sync();
  exports.Interview = Interview;