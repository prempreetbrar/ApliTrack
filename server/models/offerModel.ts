const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const {Applicant} = require("./applicantModel");
const {Job} = require("./jobModel")

const Offer = sequelize.define(
    "OFFER",
    {
      ApplicantUsername: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
      },
      OfferFileName: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
      },
      ResponseDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Compensation: {
        type: DataTypes.DECIMAL(10, 2),
      },
      StartDate: {
        type: DataTypes.DATEONLY,
      },
      Notes: {
        type: DataTypes.TEXT,
      },
      PositionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  
  Offer.belongsTo(Job, {
    foreignKey: "PositionID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  
  Job.hasMany(Offer, {
    foreignKey: "PositionID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Offer.belongsTo(Applicant, {
    foreignKey: "ApplicantUsername",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  
  Applicant.hasMany(Offer, {
    foreignKey: "ApplicantUsername",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  
/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Offer = Offer;