"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DataTypes } = require('sequelize');
const sequelize = require('../server');
const Permission = sequelize.define('PERMISSION', {
    PermissionLevel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
}, {
    timestamps: false,
});
const PermissionAbility = sequelize.define('PERMISSION_ABILITY', {
    PermissionLevel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    Ability: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
    },
}, {
    timestamps: false,
});
Permission.hasMany(PermissionAbility, {
    foreignKey: 'PermissionLevel',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
PermissionAbility.belongsTo(Permission, {
    foreignKey: "PermissionLevel",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
/*
  If any changes occurred to the model, sequelize.sync just ensures that they are
  applied to the database.
*/
sequelize.sync();
exports.Permission = Permission;
exports.PermissionAbility = PermissionAbility;
