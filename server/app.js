const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const authRouter = require("./routes/authRoutes");
const errorController = require("./controllers/errorController");

app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use(errorController);

module.exports = app;
