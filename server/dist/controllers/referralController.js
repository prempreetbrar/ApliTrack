"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory = require("./controllerFactory");
const Referral = require("../models/referralModel");
exports.createReferral = factory.createOne(Referral.Referral);
exports.deleteReferral = factory.deleteInstance(Referral.Referral);
exports.updateReferral = factory.updateInstance(Referral.Referral);
