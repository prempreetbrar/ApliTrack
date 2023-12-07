"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");
const Document = sequelize.define("DOCUMENT", {
    ApplicantUsername: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true,
    },
    DocFileName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true,
    },
    DocType: {
        type: DataTypes.STRING(32),
        allowNull: true,
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: false,
});
//Applicant has a one-to-many relationship with Document
Applicant.hasMany(Document, {
    foreignKey: 'ApplicantUsername',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Document.belongsTo(Applicant, {
    foreignKey: 'ApplicantUsername',
});
sequelize.sync();
exports.Document = Document;
