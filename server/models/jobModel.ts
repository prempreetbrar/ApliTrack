const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const { Company } = require("./companyModel");

const Job = sequelize.define(
  "JOB",
  {
    PositionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    CompanyName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "uniqueTag",
    },
    PositionName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "uniqueTag",
    },
    Description: {
      type: DataTypes.TEXT,
    },
    JobPostFile: {
      type: DataTypes.STRING(64),
    },
    PositionType: {
      type: DataTypes.STRING(32),
    },
    ApplicationDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    uniqueKeys: {
      uniqueTag: {
        fields: ["CompanyName", "PositionName"],
      },
    },
    timestamps: false,
  }
);

Job.belongsTo(Company, {
  foreignKey: "CompanyName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Company.hasMany(Job, {
  foreignKey: "CompanyName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Jobs",
});

// ---

const JobQualification = sequelize.define(
  "JOB_QUALIFICATION",
  {
    PositionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Qualification: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

JobQualification.belongsTo(Job, {
  as: "Job",
  foreignKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Job.hasMany(JobQualification, {
  as: "Qualifications",
  foreignKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ---

const JobResponsibility = sequelize.define(
  "JOB_RESPONSIBILITY",
  {
    PositionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    Responsibility: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

JobResponsibility.belongsTo(Job, {
  as: "Job",
  foreignKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Job.hasMany(JobResponsibility, {
  as: "Responsibilities",
  foreignKey: "PositionID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ---

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Job = Job;
exports.JobQualification = JobQualification;
exports.JobResponsibility = JobResponsibility;
