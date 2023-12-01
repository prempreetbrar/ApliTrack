"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../server");
const { Applicant } = require("./applicantModel");
const Interview = sequelize.define("INTERVIEW", {
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
    //   ApplicationName: {
    //     type: DataTypes.STRING(32),
    //     allowNull: false,
    //   },
}, {
    timestamps: false,
});
//Applicant has a one-to-many relationship with Interview
Applicant.hasMany(Interview, {
    foreignKey: "ApplicantUsername",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Interview.belongsTo(Applicant, {
    foreignKey: "ApplicantUsername",
});
//   APPLICATION.hasMany(INTERVIEW, {
//     foreignKey: 'ApplicationName',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   });
// Implementing a beforeCreate hook to manually increment the InterviewID
Interview.beforeCreate((instance, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maxInterviewID = yield Interview.max("InterviewID", {
            where: { ApplicantUsername: instance.ApplicantUsername },
        });
        instance.InterviewID = maxInterviewID ? maxInterviewID + 1 : 1;
    }
    catch (error) {
        // Handle any potential errors
        console.error("Error during beforeCreate hook:", error);
    }
}));
sequelize.sync();
exports.Interview = Interview;
