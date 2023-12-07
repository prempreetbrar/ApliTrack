"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory = require("./controllerFactory");
const Permission = require("../models/permissionModel");
exports.createPermission = factory.createOne(Permission.Permission);
exports.createPermissionAbility = factory.createOne(Permission.PermissionAbility);
exports.deletePermission = factory.deleteInstance(Permission.Permission);
exports.deletePermissionAbility = factory.deleteInstance(Permission.PermissionAbility);
