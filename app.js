require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const fileUpload = require("express-fileupload");
const util = require("./utils/util");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

mongoose.Promise = Promise;
mongoose
  .connect(
    "mongodb://localhost/project-lion",
    { useMongoClient: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

const app = express();

var http = require("http").createServer(app);
var io = require("socket.io")(http);

var nsp = io.of("/events");
nsp.on("connection", function(socket) {
  console.log(socket);
  console.log("user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("message", function(msg) {
    socket.emit("message", msg);
    console.log("message: " + msg);
  });
});
nsp.emit("hi", "everyone!");

io.on("connection", function(socket) {
  console.log(socket);
  console.log("user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("message", function(msg) {
    io.emit("message", msg);
    console.log("message: " + msg);
  });
});

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

// Enable authentication using session + passport
app.use(
  session({
    secret: "projectlionsafe",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
require("./passport")(app);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2) throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});
hbs.registerPartials(__dirname + "/views/partials");

// default value for title local
app.locals.title = "Project Lion";

const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

app.use(util.checkAuthentication);

const eventRoutes = require("./routes/events");
app.use("/events", eventRoutes);

const tandemRoutes = require("./routes/tandems");
app.use("/tandems", tandemRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);

module.exports = app;

// to www? conflict with socket.io
http.on("error", error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`Port ${process.env.PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${process.env.PORT}is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

http.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});
