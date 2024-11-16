"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

var _sequelize = require("sequelize");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var allowedConditions = ['gt', 'gte', 'lt', 'lte', 'ne', 'like', 'notLike', 'iLike', 'notILike', 'regexp', 'notRegexp', 'iRegexp', 'notIRegexp'];
var allowedConditionsArray = ['between', 'notBetween', 'in', 'notIn'];

var isComparableField = function isComparableField(key) {
  return key[0] !== '_';
};

var getFieldKey = function getFieldKey(key) {
  var result = key;

  if (key.indexOf('.') !== -1) {
    result = "$".concat(key, "$");
  }

  return result;
};

var getEqualOp = function getEqualOp(key, value) {
  var query = (0, _defineProperty2["default"])({}, key, value);
  return query;
};

var getConditionQuery = function getConditionQuery(filter, query) {
  var conditionQuery = {};

  if (typeof filter.condition === 'string' && (0, _typeof2["default"])(query) === 'object' && Object.keys(query).length !== 0) {
    conditionQuery = (0, _defineProperty2["default"])({}, _sequelize.Op[filter.condition], query);
  } else if (Array.isArray(query) && query.length > 1) {
    conditionQuery = (0, _defineProperty2["default"])({}, _sequelize.Op.and, query);
  } else {
    conditionQuery = query;
  }

  return conditionQuery;
};

var getFieldQuery = function getFieldQuery(filter, fieldKey, values) {
  var fieldQuery = [];
  Object.keys(values).filter(isComparableField).forEach(function (key) {
    var value = values[key];

    if (key === 'eq') {
      fieldQuery.push(getEqualOp(fieldKey, value));
    } else if (allowedConditions.includes(key) || allowedConditionsArray.includes(key) && Array.isArray(value)) {
      fieldQuery.push((0, _defineProperty2["default"])({}, fieldKey, (0, _defineProperty2["default"])({}, _sequelize.Op[key], value)));
    } else {
      // eslint-disable-next-line
      console.error("".concat(key, " operator is missing"));
    }
  });
  return fieldQuery.length > 1 ? getConditionQuery(filter, fieldQuery, values) : fieldQuery[0];
};

var getQuery = function getQuery(filter) {
  var currentQuery = {};
  Object.keys(filter).forEach(function (key) {
    var fieldValue = filter[key];
    var fieldKey = getFieldKey(key);

    if (isComparableField(fieldKey)) {
      if (Array.isArray(fieldValue) || typeof fieldValue === 'string' || typeof fieldValue === 'number') {
        Object.assign(currentQuery, getEqualOp(fieldKey, fieldValue));
      } else if ((0, _typeof2["default"])(fieldValue) === 'object') {
        Object.assign(currentQuery, getFieldQuery(filter, fieldKey, fieldValue));
      }
    }
  });
  return currentQuery;
};

var getOrQuery = function getOrQuery(orQueryParam) {
  if (!(orQueryParam !== null && orQueryParam !== void 0 && orQueryParam.length)) {
    return null;
  }

  var orQuery = [];
  orQueryParam.forEach(function (orObject) {
    var query = getQuery(orObject);

    if (!(0, _isEmpty["default"])(query)) {
      orQuery.push(query);
    }
  });
  return orQuery !== null && orQuery !== void 0 && orQuery.length ? (0, _defineProperty2["default"])({}, _sequelize.Op.or, orQuery) : null;
};

var generateWhereQuery = function generateWhereQuery(filterParam) {
  if (!filterParam) {
    return undefined;
  }

  var filter = (0, _cloneDeep["default"])(filterParam);
  var query = {}; // ****** OR CONDITION *********

  var orFilter = filter.or;

  if (orFilter) {
    var orQuery = getOrQuery(orFilter);

    if (orQuery) {
      query = _objectSpread({}, orQuery);
    }
  }

  delete filter.or; // ****** OR CONDITION *********

  var andQuery = getQuery(filter);
  query = _objectSpread(_objectSpread({}, query), andQuery);
  return query;
};

var generateQuery = function generateQuery(query) {
  if (!query) {
    return null;
  } // To send the query for order or where condition please refer
  // https://github.com/segemun/sequelize-search-builder#request-examples


  var order = query.order,
      filter = query.filter;
  return {
    order: order ? Object.entries(order) : null,
    where: generateWhereQuery(filter)
  };
};

module.exports = generateQuery;