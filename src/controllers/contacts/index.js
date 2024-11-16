import express from 'express';
import validateRequest from 'utils/validateRequest';
import contactsPolicy from 'policies/contacts/contacts.policy';
import createSyncContactController from './createSyncContactController';
import getSyncContactController from './getSyncContactController';
import authenticateToken from '../../middleware/authentication';

const router = express.Router();

router
  .route('/sync')
  .post(
    authenticateToken,
    validateRequest(contactsPolicy),
    createSyncContactController,
  )
  .get(authenticateToken, getSyncContactController);

module.exports = router;
