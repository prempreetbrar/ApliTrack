const path = require("path");
const fs = require("fs");

const factory = require("./controllerFactory");
const Offer = require("../models/offerModel");
const errorHandling = require("../utils/errorHandling");

exports.createOffer = factory.createOne(Offer.Offer);
exports.deleteOffer = factory.deleteInstance(Offer.Offer);
exports.updateOffer = factory.updateOneWithKey(Offer.Offer);

exports.getOffer = factory.getOne(Offer.Offer);
exports.getAllOffers = factory.getAll(Offer.Offer);
exports.getAllApplicantOffers = factory.getAll(Offer.Offer);

exports.filterApplicantFile = errorHandling.catchAsync(
  async (request, response, next) => {
    request.body.filter = {
      ApplicantUsername: request.body.ApplicantUsername,
      OfferFileName: request.body.OfferFileName,
    };
    next();
  }
);

exports.filterApplicant = errorHandling.catchAsync(
  async (request, response, next) => {
    request.body.filter = {
      ApplicantUsername: request.body.ApplicantUsername,
    };
    next();
  }
);

exports.uploadFile = errorHandling.catchAsync(
  async (request, response, next) => {
    // Check if a file was uploaded
    if (!request.file) {
      next();
      return;
    }

    // Write the file to the upload directory
    // Resolve the absolute path to the uploads directory
    const uploadsPath = path.resolve(__dirname, "../uploads/offers");

    // Ensure the directory exists, create it if not
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    // Construct the file path
    let fileName = request.file.originalname;
    fs.readdir("../uploads/offers", (err, files) => {
      if (files) {
        fileName =
          request.file.originalname.split(".")[0] +
          " - " +
          "[" +
          files.length +
          1 +
          "]." +
          request.file.originalname.split(".")[1];
      }
    });

    const filePath = path.join(uploadsPath, fileName);

    const readStream = fs.createReadStream(request.file.path);
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("File written successfully");
      fs.unlinkSync(request.file.path);
    });

    console.log("In controller", request.body, request.params);
    request.body.OfferFileName = fileName;
    next();
  }
);
