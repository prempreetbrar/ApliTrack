const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../server");

const { AppError } = require("../utils/errorHandling");

const User = sequelize.define(
  "USER",
  {
    Username: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    Password: {
      type: DataTypes.CHAR(64),
      comment: "64 hex chars to store SHA256 hash",
    },
    PasswordConfirm: {
      type: DataTypes.CHAR(64),
      validate: {
        matchesPassword(value) {
          if (value !== this.Password) {
            throw new AppError("Please make sure your passwords match.", 401);
          }
        },
      },
      comment: "Ensuring that the entered password equals the confirmed one.",
    },
    Fname: {
      type: DataTypes.STRING(16),
    },
    Lname: {
      type: DataTypes.STRING(16),
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Setting the default value to true (or 1)
    },
  },
  {
    timestamps: false, // we don't need to store the time of creation or updation
  }
);

/*
  ALL HOOKS (the following section) are applied AFTER any validate functions in the schema.
  For example, User.beforeCreate FIRST checks if PasswordConfirm matches Password, BEFORE going
  ahead and hashing it.
*/
User.beforeCreate(async (user, options) => {
  user.Password = await bcrypt.hash(user.Password, 12);
  user.PasswordConfirm = undefined;
});

sequelize.sync();
module.exports = User;
