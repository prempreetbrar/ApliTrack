const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");

const Document = sequelize.define(
  "DOCUMENT",
  {
    DocumentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ApplicantUsername: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "uniqueTag",
    },
    DocFileName: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "uniqueTag",
    },
    DocType: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    initialAutoIncrement: 1,
    timestamps: false,
    uniqueKeys: {
      uniqueTag: {
        fields: ["ApplicantUsername", "DocFileName"],
      },
    },
  }
);

//Applicant has a one-to-many relationship with Document
Applicant.hasMany(Document, {
  as: "Documents",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Document.belongsTo(Applicant, {
  as: "Applicant",
  foreignKey: "ApplicantUsername",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize.sync();
exports.Document = Document;
