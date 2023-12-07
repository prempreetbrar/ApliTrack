"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require('sequelize');
const sequelize = require('../server');
const User = require('./userModel');
const { Permission } = require('./permissionModel');
const Admin = sequelize.define('ADMIN', {
    Username: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
    },
    DeveloperFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    DeveloperType: {
        type: DataTypes.STRING(64),
    },
}, {
    timestamps: false,
});
Admin.belongsTo(User, {
    foreignKey: 'Username',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
User.hasMany(Admin, { foreignKey: 'ContID',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
const Admin_Responsibility = sequelize.define('ADMIN_RESPONSIBILITY', {
    AdminUsername: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
    },
    Responsibility: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
    },
}, {
    timestamps: false,
});
Admin.hasMany(Admin_Responsibility, {
    foreignKey: 'AdminUsername',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Admin_Responsibility.belongsTo(Admin, {
    foreignKey: "AdminUsername",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
const Dev_Specialization = sequelize.define('DEV_SPECIALIZATION', {
    AdminUsername: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        allowNull: false,
    },
    Specialization: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
    },
}, {
    timestamps: false,
});
Admin.hasMany(Dev_Specialization, {
    foreignKey: 'AdminUsername',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Dev_Specialization.belongsTo(Admin, {
    foreignKey: "AdminUsername",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
// definition of many-to-many relationship b/t Admin and Permission
const AdminHasPerm = sequelize.define('ADMIN_HAS_PERM', {}, { timestamps: false });
Admin.belongsToMany(Permission, { through: AdminHasPerm });
Permission.belongsToMany(Admin, { through: AdminHasPerm });
/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Admin = Admin;
exports.Admin_Responsibility = Admin_Responsibility;
exports.Dev_Specialization = Dev_Specialization;
exports.AdminHasPerm = AdminHasPerm;
