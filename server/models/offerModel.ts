const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");
const { Job } = require("./jobModel");

const Offer = sequelize.define(
  "OFFER",
  {
    OfferID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "actions_unique",
    },
    OfferFileName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "actions_unique",
    },
    ResponseDeadline: {
      type: DataTypes.DATEONLY,
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
    uniqueKeys: {
      actions_unique: {
        fields: ["ApplicantUsername", "OfferFileName"],
      },
    },
    noPrimaryKey: true,
  }
);

Offer.belongsTo(Job, {
  as: "Job",
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
