const { DataTypes } = require("sequelize");
const sequelize = require("../server");

const Company = sequelize.define(
    "COMPANY",
    {
      CompanyName: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
      },
      Industry: {
        type: DataTypes.STRING(64),
      },
      HomePageURL: {
        type: DataTypes.STRING(64),
      },
      Description: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );

sequelize.sync();
exports.Company = Company;