const jwt = require("jsonwebtoken");

const server = require("../server");
const errorHandling = require("../utils/errorHandling");

function signToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}

exports.signUpUser = errorHandling.catchAsync(async (request, response) => {
  console.log("IN HERE!");
  const existingUser = await server.db.get(
    "SELECT * FROM USER WHERE Username = $email",
    {
      $email: request.body.username,
    }
  );
  console.log(existingUser);

  if (existingUser) {
    throw new errorHandling.AppError(
      `A user with the specified username ${request.email} already exists.`,
      409
    );
  }

  response.status(200).json({
    status: "success",
  });

  // const newUser = await User.create({
  //   name: request.body.name,
  //   email: request.body.email,
  //   password: request.body.password,
  //   passwordConfirm: request.body.confirmPassword,
  // });

  // await new Email(
  //   newUser,
  //   `${request.protocol}://${request.get("host")}/me`
  // ).sendWelcome();
  // createSendToken(newUser, 201, request, response);
});
