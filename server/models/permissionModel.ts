// THIS MODEL IS NOT USED
/*
It was decided that having Permission and Permission_Ability tables was redundant, since combining the 
Admin flag and PermissionLevel in the User table simplified the backend while maintaining desired functionality. 
We also removed the Developer flag and Dev_Specialization table because a developer/admin's permissions 
and abilities are normally managed in the GitHub repository, NOT in the actual application itself. 
*/

const { DataTypes } = require('sequelize');
const sequelize = require('../server');

const Permission = sequelize.define(
    'PERMISSION', {
  PermissionLevel: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
}, 
{
  timestamps: false,
});

const PermissionAbility = sequelize.define(
    'PERMISSION_ABILITY', {
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
}, 
{
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