"use strict";

var _require = require("./exceptions"),
    BadRequestException = _require.BadRequestException;
/**
 *
 * @param {json} schema It is a simple json object which should have either
 *  of headers, params, query, body the value of these parameters could be a function or
 *  a valid Joi Schema if it is a function the function needs to return an object with
 *  either response param or error param
 *
 * @param {boolean} failFast determines if you want to continue validating
 *  after failure of one validation and move on to next validation.
 *  Example: If headers validation fails move on to body validation if failFast is false,
 *  for Joi specific failfast please pass { abortEarly: false } to joi validation method
 *
 * This middleware takes in a schema object and if the schema validation succeeds it
 * passes on to the next middleware, if the validation failes it returns response with
 * bad request
 *
 */


var validateRequest = function validateRequest(schema) {
  var failFast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return function (req, res, next) {
    var validationErrors = [];
    Object.keys(schema).some(function (rule) {
      var error;

      if (typeof schema[rule] !== 'function') {
        var _schema$rule$validate = schema[rule].validate(req[rule]),
            validationError = _schema$rule$validate.error;

        if (validationError) {
          error = validationError.details[0].message.toString();
        }
      } else if (schema[rule](req)) error = schema[rule](req).error;

      if (error) {
        validationErrors.push(error);
        return failFast;
      }

      return error;
    });

    if (validationErrors.length > 0) {
      throw new BadRequestException("".concat(validationErrors));
    }

    return next();
  };
};

module.exports = validateRequest;