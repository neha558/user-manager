import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import { QueryTypes, Op } from 'sequelize';

const mergeRequestAndFoundedCOntactArray = (
  inputContacts,
  contacts,
) => {
  const mergeArray = [];
  inputContacts.forEach((addressDetail) => {
    const greaterThanTen = contacts.find(
      (element) =>
        element.contactNumber.toString() ===
        addressDetail.contactNumber.toString(),
    );
    mergeArray.push({
      ...addressDetail,
      firstName: greaterThanTen.firstName,
      lastName: greaterThanTen.lastName,
    });
  });
  return mergeArray;
};

const deleteRecord = async (differenceObject) => {
  const deleteContacts = [];
  differenceObject.map((contact) => {
    deleteContacts.push(contact.contactNumber);
    return contact;
  });
  await models.syncedContacts.destroy({
    where: {
      contactNumber: { [Op.in]: deleteContacts },
    },
    force: true,
  });
};

const updateRecords = (updatesContactsMerged) => {
  const updateContactPromises = updatesContactsMerged.map((contact) =>
    models.syncedContacts.update(
      {
        firstName: contact.firstName,
        lastName: contact.lastName,
      },
      {
        where: {
          userId: contact.userId,
          contactNumber: contact.contactNumber,
        },
      },
    ),
  );

  return Promise.all(updateContactPromises)
    .then((responseObject) => {
      logger.message(
        `Executing createSyncContactService bulkUpdate was successful ${responseObject}`,
      );
    })
    .catch((error) => {
      logger.message(
        `Error occurred while executing createSyncContactService bulkCreate ${error}`,
      );
    });
};

const queryGenerators = (contactNumbersArray, currentUserId) => {
  const query = `
  SELECT "users"."userId", "users"."firstName" AS "systemFirstName", "users"."lastName" AS "systemLastName", "users"."email", "users"."userName" AS "contactUserName", "users"."mobileNumber",
  "isFollowed"."userId" AS "isFollowed",
  "isFollower"."userId" AS "isFollower",
   CASE
        WHEN "users"."mobileNumber" IS NOT NULL THEN "users"."mobileNumber"
        ELSE "users"."mobileNumber"
    END AS "contactNumber",
    CASE
        WHEN "isFollowed" IS NULL THEN false
        ELSE true
    END AS "isFollowed",
	CASE
        WHEN "isFollower" IS NULL THEN false
        ELSE true
    END AS "isFollower"
  FROM "users" AS "users"
  LEFT OUTER JOIN "follows" AS "isFollowed" ON "users"."userId" = "isFollowed"."userId" AND "isFollowed"."followerId" = ${currentUserId}
  LEFT OUTER JOIN "follows" AS "isFollower" ON "users"."userId" = "isFollower"."followerId" AND "isFollower"."userId" = ${currentUserId}
  WHERE "users"."mobileNumber" IN (${contactNumbersArray});
  `;
  logger.message(
    `Executing queryGenerators SyncContactService was successful ${query}`,
  );
  return query;
};

const findDifference = (inputContactsClone, syncedContactsClone) => {
  const inputContacts = [];
  inputContactsClone.map((contact) =>
    inputContacts.push(contact.contactNumber),
  );
  const syncedContacts = [];
  syncedContactsClone.map((contact) =>
    syncedContacts.push(contact.contactNumber),
  );

  const updateArray = syncedContactsClone
    .map((syncedContact) => {
      if (inputContacts.includes(syncedContact.contactNumber)) {
        return syncedContact;
      }
      return null;
    })
    .filter((updatedContact) => updatedContact);
  const addedArray = inputContactsClone
    .map((inputContact) => {
      if (!syncedContacts.includes(inputContact.contactNumber)) {
        return inputContact;
      }
      return null;
    })
    .filter((addedContact) => addedContact);

  const deleteArray = syncedContactsClone
    .map((syncedContact) => {
      if (!inputContacts.includes(syncedContact.contactNumber)) {
        return syncedContact;
      }
      return null;
    })
    .filter((deletedContact) => deletedContact);
  return {
    updateArray,
    addedArray,
    deleteArray,
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

const createSyncContactService = (contactDetails) => {
  logger.message(`Executing createSyncContactService`);
  return new Promise((resolve, reject) => {
    logger.message(`Executing createSyncContactService`);
    const contactNumbersArray = [];
    contactDetails.contacts.map((contact) => {
      const { contactNumber } = contact;
      contactNumbersArray.push(`'${contactNumber}'`);
      // eslint-disable-next-line no-param-reassign
      contact.userId = contactDetails.user?.userId;
      return contact;
    });
    return models.sequelize
      .query(
        queryGenerators(
          contactNumbersArray,
          contactDetails.user?.userId,
        ),
        {
          type: QueryTypes.SELECT,
        },
      )
      .then(async (responseContactObject) => {
        logger.message(
          `Executing createSyncContactService was successful`,
        );
        responseContactObject.map((contact) => {
          // eslint-disable-next-line no-param-reassign
          contact.contactUserId = contact.userId;
          // eslint-disable-next-line no-param-reassign
          contact.userId = contactDetails.user?.userId;
          // eslint-disable-next-line no-param-reassign
          contact.userId = contactDetails.user?.userId;
          return contact;
        });
        const { contacts } = contactDetails;

        const inputsContactsLists = mergeRequestAndFoundedCOntactArray(
          responseContactObject,
          contacts,
        );
        const syncedContactsLists = await models.syncedContacts.findAll(
          {
            where: { userId: contactDetails.user?.userId },
            raw: true,
            nest: true,
          },
        );

        const differenceObject = findDifference(
          inputsContactsLists,
          syncedContactsLists,
        );
        if (differenceObject.deleteArray) {
          await deleteRecord(differenceObject.deleteArray);
        }
        if (differenceObject.updateArray) {
          const updatesContactsMerged = mergeRequestAndFoundedCOntactArray(
            differenceObject.updateArray,
            contacts,
          );
          await updateRecords(updatesContactsMerged);
        }
        return models.syncedContacts
          .bulkCreate(differenceObject.addedArray, {
            updateOnDuplicate: ['userId', 'contactNumber'],
          })
          .then(() => {
            logger.message(
              `Executing createSyncContactService bulkCreate was successful`,
            );
            return resolve();
          })
          .catch((error) => {
            logger.message(error);
            logger.message(
              `Error occurred while executing createSyncContactService bulkCreate ${
                error?.stack || error
              }`,
            );
            return reject(
              new ServerException('Unable to create syncedContacts'),
            );
          });
      })
      .catch((error) => {
        logger.message(error);
        logger.message(
          `Error occurred while executing createSyncContactService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to create syncedContacts'),
        );
      });
  });
};

module.exports = createSyncContactService;
