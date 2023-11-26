const { DataTypes } = require("sequelize");
const sequelize = require("../server");
const User = require("./userModel");

const Applicant = sequelize.define(
  "APPLICANT",
  {
    Username: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    Education: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

// Define the foreign key relationship
Applicant.belongsTo(User, {
  foreignKey: "Username",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize.sync();
module.exports = Applicant;
