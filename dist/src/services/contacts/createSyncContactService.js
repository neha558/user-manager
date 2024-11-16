"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _sequelize = require("sequelize");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mergeRequestAndFoundedCOntactArray = function mergeRequestAndFoundedCOntactArray(inputContacts, contacts) {
  var mergeArray = [];
  inputContacts.forEach(function (addressDetail) {
    var greaterThanTen = contacts.find(function (element) {
      return element.contactNumber.toString() === addressDetail.contactNumber.toString();
    });
    mergeArray.push(_objectSpread(_objectSpread({}, addressDetail), {}, {
      firstName: greaterThanTen.firstName,
      lastName: greaterThanTen.lastName
    }));
  });
  return mergeArray;
};

var deleteRecord = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(differenceObject) {
    var deleteContacts;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            deleteContacts = [];
            differenceObject.map(function (contact) {
              deleteContacts.push(contact.contactNumber);
              return contact;
            });
            _context.next = 4;
            return _models["default"].syncedContacts.destroy({
              where: {
                contactNumber: (0, _defineProperty2["default"])({}, _sequelize.Op["in"], deleteContacts)
              },
              force: true
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function deleteRecord(_x) {
    return _ref.apply(this, arguments);
  };
}();

var updateRecords = function updateRecords(updatesContactsMerged) {
  var updateContactPromises = updatesContactsMerged.map(function (contact) {
    return _models["default"].syncedContacts.update({
      firstName: contact.firstName,
      lastName: contact.lastName
    }, {
      where: {
        userId: contact.userId,
        contactNumber: contact.contactNumber
      }
    });
  });
  return Promise.all(updateContactPromises).then(function (responseObject) {
    _logger["default"].message("Executing createSyncContactService bulkUpdate was successful ".concat(responseObject));
  })["catch"](function (error) {
    _logger["default"].message("Error occurred while executing createSyncContactService bulkCreate ".concat(error));
  });
};

var queryGenerators = function queryGenerators(contactNumbersArray, currentUserId) {
  var query = "\n  SELECT \"users\".\"userId\", \"users\".\"firstName\" AS \"systemFirstName\", \"users\".\"lastName\" AS \"systemLastName\", \"users\".\"email\", \"users\".\"userName\" AS \"contactUserName\", \"users\".\"mobileNumber\",\n  \"isFollowed\".\"userId\" AS \"isFollowed\",\n  \"isFollower\".\"userId\" AS \"isFollower\",\n   CASE\n        WHEN \"users\".\"mobileNumber\" IS NOT NULL THEN \"users\".\"mobileNumber\"\n        ELSE \"users\".\"mobileNumber\"\n    END AS \"contactNumber\",\n    CASE\n        WHEN \"isFollowed\" IS NULL THEN false\n        ELSE true\n    END AS \"isFollowed\",\n\tCASE\n        WHEN \"isFollower\" IS NULL THEN false\n        ELSE true\n    END AS \"isFollower\"\n  FROM \"users\" AS \"users\"\n  LEFT OUTER JOIN \"follows\" AS \"isFollowed\" ON \"users\".\"userId\" = \"isFollowed\".\"userId\" AND \"isFollowed\".\"followerId\" = ".concat(currentUserId, "\n  LEFT OUTER JOIN \"follows\" AS \"isFollower\" ON \"users\".\"userId\" = \"isFollower\".\"followerId\" AND \"isFollower\".\"userId\" = ").concat(currentUserId, "\n  WHERE \"users\".\"mobileNumber\" IN (").concat(contactNumbersArray, ");\n  ");

  _logger["default"].message("Executing queryGenerators SyncContactService was successful ".concat(query));

  return query;
};

var findDifference = function findDifference(inputContactsClone, syncedContactsClone) {
  var inputContacts = [];
  inputContactsClone.map(function (contact) {
    return inputContacts.push(contact.contactNumber);
  });
  var syncedContacts = [];
  syncedContactsClone.map(function (contact) {
    return syncedContacts.push(contact.contactNumber);
  });
  var updateArray = syncedContactsClone.map(function (syncedContact) {
    if (inputContacts.includes(syncedContact.contactNumber)) {
      return syncedContact;
    }

    return null;
  }).filter(function (updatedContact) {
    return updatedContact;
  });
  var addedArray = inputContactsClone.map(function (inputContact) {
    if (!syncedContacts.includes(inputContact.contactNumber)) {
      return inputContact;
    }

    return null;
  }).filter(function (addedContact) {
    return addedContact;
  });
  var deleteArray = syncedContactsClone.map(function (syncedContact) {
    if (!inputContacts.includes(syncedContact.contactNumber)) {
      return syncedContact;
    }

    return null;
  }).filter(function (deletedContact) {
    return deletedContact;
  });
  return {
    updateArray: updateArray,
    addedArray: addedArray,
    deleteArray: deleteArray
  };
};
/**
 *
 * @param {
 * "name":string
 * "syncedContactsType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */


var createSyncContactService = function createSyncContactService(contactDetails) {
  _logger["default"].message("Executing createSyncContactService");

  return new Promise(function (resolve, reject) {
    var _contactDetails$user2;

    _logger["default"].message("Executing createSyncContactService");

    var contactNumbersArray = [];
    contactDetails.contacts.map(function (contact) {
      var _contactDetails$user;

      var contactNumber = contact.contactNumber;
      contactNumbersArray.push("'".concat(contactNumber, "'")); // eslint-disable-next-line no-param-reassign

      contact.userId = (_contactDetails$user = contactDetails.user) === null || _contactDetails$user === void 0 ? void 0 : _contactDetails$user.userId;
      return contact;
    });
    return _models["default"].sequelize.query(queryGenerators(contactNumbersArray, (_contactDetails$user2 = contactDetails.user) === null || _contactDetails$user2 === void 0 ? void 0 : _contactDetails$user2.userId), {
      type: _sequelize.QueryTypes.SELECT
    }).then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(responseContactObject) {
        var _contactDetails$user5;

        var contacts, inputsContactsLists, syncedContactsLists, differenceObject, updatesContactsMerged;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _logger["default"].message("Executing createSyncContactService was successful");

                responseContactObject.map(function (contact) {
                  var _contactDetails$user3, _contactDetails$user4;

                  // eslint-disable-next-line no-param-reassign
                  contact.contactUserId = contact.userId; // eslint-disable-next-line no-param-reassign

                  contact.userId = (_contactDetails$user3 = contactDetails.user) === null || _contactDetails$user3 === void 0 ? void 0 : _contactDetails$user3.userId; // eslint-disable-next-line no-param-reassign

                  contact.userId = (_contactDetails$user4 = contactDetails.user) === null || _contactDetails$user4 === void 0 ? void 0 : _contactDetails$user4.userId;
                  return contact;
                });
                contacts = contactDetails.contacts;
                inputsContactsLists = mergeRequestAndFoundedCOntactArray(responseContactObject, contacts);
                _context2.next = 6;
                return _models["default"].syncedContacts.findAll({
                  where: {
                    userId: (_contactDetails$user5 = contactDetails.user) === null || _contactDetails$user5 === void 0 ? void 0 : _contactDetails$user5.userId
                  },
                  raw: true,
                  nest: true
                });

              case 6:
                syncedContactsLists = _context2.sent;
                differenceObject = findDifference(inputsContactsLists, syncedContactsLists);

                if (!differenceObject.deleteArray) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 11;
                return deleteRecord(differenceObject.deleteArray);

              case 11:
                if (!differenceObject.updateArray) {
                  _context2.next = 15;
                  break;
                }

                updatesContactsMerged = mergeRequestAndFoundedCOntactArray(differenceObject.updateArray, contacts);
                _context2.next = 15;
                return updateRecords(updatesContactsMerged);

              case 15:
                return _context2.abrupt("return", _models["default"].syncedContacts.bulkCreate(differenceObject.addedArray, {
                  updateOnDuplicate: ['userId', 'contactNumber']
                }).then(function () {
                  _logger["default"].message("Executing createSyncContactService bulkCreate was successful");

                  return resolve();
                })["catch"](function (error) {
                  _logger["default"].message(error);

                  _logger["default"].message("Error occurred while executing createSyncContactService bulkCreate ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                  return reject(new _exceptions.ServerException('Unable to create syncedContacts'));
                }));

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message(error);

      _logger["default"].message("Error occurred while executing createSyncContactService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to create syncedContacts'));
    });
  });
};

module.exports = createSyncContactService;