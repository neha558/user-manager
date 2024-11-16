"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _controllers = _interopRequireDefault(require("./src/controllers"));

var _logger = _interopRequireDefault(require("./config/logger"));

var _models = _interopRequireDefault(require("./src/models"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

var _cors = _interopRequireDefault(require("cors"));

var _passport = _interopRequireDefault(require("passport"));

var _socket = _interopRequireDefault(require("socket.io"));

var _facebookAuth = _interopRequireDefault(require("./src/services/auth/facebookAuth"));

var _googleAuth = _interopRequireDefault(require("./src/services/auth/googleAuth"));

var _createKafkaTopics = _interopRequireDefault(require("./src/kafka/createKafkaTopics"));

// eslint-disable-next-line import/named
var app = (0, _express["default"])(); // Passport session setup.

_passport["default"].serializeUser(function (user, done) {
  done(null, user);
});

_passport["default"].deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(_passport["default"].initialize()); // app.use(passport.session());

_dotenv["default"].config();

app.use(_express["default"].json());
app.use((0, _expressFileupload["default"])());
app.use((0, _cors["default"])()); // Parse application/x-www-form-urlencoded

app.use(_express["default"].urlencoded({
  extended: true
})); // Setting middleware for static resources

app.use(_express["default"]["static"]('public')); // Application health end point

app.get('/user-manager/health', function (req, res) {
  var healthStatus = {
    status: 'UP'
  };

  _models["default"].sequelize.authenticate().then(function () {
    healthStatus.status = 'UP';
    return res.send(healthStatus);
  })["catch"](function (error) {
    healthStatus.status = 'Down';
    healthStatus.error = error;
    return res.status(503).send(healthStatus);
  });
}); // BEING FACEBOOK LOGIN ROUTES

app.get('/user-manager/auth/facebook', (0, _facebookAuth["default"])('signup'));
app.get('/user-manager/auth/facebook/callback', (0, _facebookAuth["default"])('callback'), function (req, res) {
  var _req$user, _req$user2, _req$user3;

  var response = (_req$user = req.user) !== null && _req$user !== void 0 && _req$user.token ? "?token=".concat((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.token) : "?error=".concat((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.error);
  res.redirect("".concat(process.env.CALLBACK_REDIRECT_URL).concat(response));
}); // ENDING FACEBOOK LOGIN ROUTES
// BEING GOOGLE LOGIN ROUTES

app.get('/user-manager/auth/google', (0, _googleAuth["default"])('signup'));
app.get('/user-manager/auth/google/callback', (0, _googleAuth["default"])('callback'), function (req, res) {
  var _req$user4, _req$user5, _req$user6;

  var response = (_req$user4 = req.user) !== null && _req$user4 !== void 0 && _req$user4.token ? "?token=".concat((_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.token) : "?error=".concat((_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.error);
  res.redirect("".concat(process.env.CALLBACK_REDIRECT_URL).concat(response));
}); // ENDING GOOGLE LOGIN ROUTES
// Loading all the routes

app.use('/user-manager/v1', _controllers["default"]);
app.use(function (req, res) {
  _logger["default"].message("Route not found in user-manager ".concat(req.originalUrl, " for method ").concat(req.method));

  res.status(404).json({
    error: "Cannot ".concat(req.method, " ").concat(req.originalUrl)
  });
}); // Default 500 is returned if the route is not available
// eslint-disable-next-line no-unused-vars

app.use(function (error, req, res, next) {
  if (error.statusCode && error.title) {
    res.status(error.statusCode).json({
      error: {
        title: error.title,
        description: error.description
      }
    });
  } else {
    _logger["default"].message("Uncaught error occurred status : 500 ".concat(error === null || error === void 0 ? void 0 : error.stack), 'error');

    res.status(500).json({
      error: {
        title: 'Request timed out',
        description: 'Request has timed out, please try again'
      }
    });
  }
});

_models["default"].sequelize.sync({
  force: false
})["catch"](function (error) {
  _logger["default"].message("Error occurred while connecting to database ".concat(error.stack || error));

  process.exit();
}); // Function to start express server


var startServer = function startServer() {
  return app.listen(process.env.PORT, function () {
    (0, _createKafkaTopics["default"])();

    _logger["default"].message("User Manager Running on port ".concat(process.env.PORT, " environment is ").concat(process.env.NODE_ENV));
  });
}; // This function is not used much, it can be used in test-cases when server is mocked


var stopServer = function stopServer() {
  app.close(function () {
    process.exit();
  });
}; // Start the server


var server = startServer();
var io = (0, _socket["default"])(server, {
  path: '/user-manager/socket.io',
  cors: {
    origin: '*'
  }
});
app.set('io', io); // On connection join room of all people you follow

io.on('connection', function (socketInstance) {
  var _socketInstance$reque, _socketInstance$reque2;

  // eslint-disable-next-line no-underscore-dangle
  var userId = socketInstance === null || socketInstance === void 0 ? void 0 : (_socketInstance$reque = socketInstance.request) === null || _socketInstance$reque === void 0 ? void 0 : (_socketInstance$reque2 = _socketInstance$reque._query) === null || _socketInstance$reque2 === void 0 ? void 0 : _socketInstance$reque2.userId;

  if (userId) {
    // Connected user joins their own room because, in case of multiple tabs,
    // we can simply send the data to these rooms thus providing real time
    // notification to all the tabs
    _logger["default"].message("Received connection request from user ".concat(userId));

    socketInstance.join("session-of-".concat(userId));
  }
});
/**
 *  We are exporting start and stop server so that this
 * can be accessed by test cases to mock the server
 * */

module.exports = {
  startServer: startServer,
  stopServer: stopServer
};