const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");

const Application = sequelize.define(
  'APPLICATION',
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
    foreignKey: 'ApplicantUsername',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Applicantion.belongsTo(Applicant, {
    foreignKey: 'ApplicantUsername',
});

//TODO: later
//Application has a many-to-many relationship with Document

sequelize.sync();
exports.Application = Application;
