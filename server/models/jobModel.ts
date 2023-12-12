const { DataTypes } = require("sequelize");
const sequelize = require("../server");

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


exports.Job = Job;
exports.JobQualification = JobQualification;
exports.JobResponsibility = JobResponsibility;
const { Company } = require("./companyModel");
const { Interview } = require("./interviewModel");

Job.belongsTo(Company, {
  as: "Companies",
  foreignKey: "CompanyName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Company.hasMany(Job, {
  as: "Jobs",
  foreignKey: "CompanyName",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Job has a many-to-many relationship with interview
const JobMentionsInterview = sequelize.define(
  "MENTIONS",
  {
    PositionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Job,
        key: "PositionID",
      },
    },
    InterviewID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Interview,
        key: "InterviewID",
      },
    },
  },
  {
    timestamps: false,
  }
);

Job.belongsToMany(Interview, {
  as: "Interviews",
  through: JobMentionsInterview,
  foreignKey: "PositionID",
  otherKey: "InterviewID",
});
Interview.belongsToMany(Job, {
  as: "Jobs",
  through: JobMentionsInterview,
  foreignKey: "InterviewID",
  otherKey: "PositionID",
});

exports.JobMentionsInterview = JobMentionsInterview;

/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();