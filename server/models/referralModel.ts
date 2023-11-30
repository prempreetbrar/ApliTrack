const { DataTypes } = require('sequelize');
const sequelize = require('../server');
const { Applicant } = require('./applicantModel');
const { Contact } = require('./contactModel');
const { Job } = require('./jobModel');

const Referral = sequelize.define('REFERRAL', {
  ReferralID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ContID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATEONLY,
  },
  Notes: {
    type: DataTypes.TEXT,
  },
  ApplicantUsername: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  JobID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, 
{
  timestamps: false,
});

Referral.belongsTo(Contact, 
    { foreignKey: 'ContID',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Contact.hasMany(Referral,
    { foreignKey: 'ContID',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Referral.belongsTo(Applicant, 
    { foreignKey: 'ApplicantUsername',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Applicant.hasMany(Referral,
    { foreignKey: 'ApplicantUsername',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Referral.belongsTo(Job, { 
    foreignKey: 'JobID', 
    onDelete: "CASCADE",
    onUpdate: "CASCADE", 
});

Job.hasMany(Referral,
    { foreignKey: 'JobID',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

sequelize.sync();
exports.Referral = Referral;