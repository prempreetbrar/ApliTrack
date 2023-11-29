/*
  This is where we attach all of our ExpressJS middleware.
  In Express, as a request moves through the request-response cycle,
  it goes through these functions in the middle (hence the name middleware).

  cookieParser lets us accept cookies, cors is for security, express.json
  allows us to accept an incoming request as JSON which is much simpler to use,
  and afterwards we register all of our routes (our urls).
*/

const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const applicantRouter = require("./routes/applicantRoutes");
const contactRouter = require("./routes/contactRoutes");
const companyRouter = require("./routes/companyRoutes");
const jobRouter = require("./routes/jobRoutes");
const offerRouter = require("./routes/offerRoutes");
const applicationRouter = require("./routes/applicationRoutes");
const errorController = require("./controllers/errorController");

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

/*
  The errorController goes last in the middleware stack. This is because anytime ExpressJS 
  encounters an error, it "throws" it into the error-handling middleware that is taking 4 arguments 
  (the request, response, next, and an additional "error" argument). We want it last
  so that it can catch the errors from ALL of our routes.

  For example, if we had a middleware stack of A, errorController, B, then if an error occurs in B,
  Express will be unable to handle the error. This is because it already "skipped" the
  errorController in the middleware stack.

  Above, our middleware stack is CORS, ... , express.JSON. Below, after we register the routes,
  it is CORS, ... , lastRoute, errorController.
*/
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/applicants", applicantRouter);
app.use("/api/contact", contactRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/offer", offerRouter);
app.use("/api/applications", applicationRouter);
app.use(errorController);

module.exports = app;
