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
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../server");
const { AppError } = require("../utils/errorHandling");
const User = sequelize.define("USER", {
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
}, {
    timestamps: false, // we don't need to store the time of creation or updation
    /*
      We don't want to be returning the password through queries unless needed in specific
      cases (like checking login or authentication). In those cases, we'll manually override this.
      Why? Returning passwords from a query (even hashed) is a security risk.
    */
    defaultScope: {
        attributes: { exclude: ["Password"] },
    },
});
/*
  ALL HOOKS (the following section) are applied AFTER any validate functions in the schema.
  For example, User.beforeSave FIRST checks if PasswordConfirm matches Password, BEFORE going
  ahead and hashing it.
*/
User.beforeSave((user, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.Password) {
        user.Password = yield bcrypt.hash(user.Password, 12);
        user.PasswordConfirm = undefined;
    }
}));
User.prototype.isPasswordCorrect = function (candidatePassword, actualPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(candidatePassword, actualPassword);
    });
};
/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
module.exports = User;
