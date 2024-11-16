import express from 'express';
import validateRequest from 'utils/validateRequest';
import addressPolicy from 'policies/address/address.policy';
import createAddress from './createAddressController';
import getAddress from './getAddressController';
import updateAddress from './updateAddressController';

const router = express.Router();

router.route('/').post(validateRequest(addressPolicy), createAddress);

router
  .route('/:id')
  .get(getAddress)
  .put(validateRequest(addressPolicy), updateAddress);

module.exports = router;
