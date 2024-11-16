import express from 'express';

import uploadFileSchema from 'policies/file/uploadFile.policy';
import validateRequest from 'utils/validateRequest';

import uploadFile from './uploadFileController';
import getFile from './getFileController';

const router = express.Router();

router.route('/').post(validateRequest(uploadFileSchema), uploadFile);
router.route('/:fileId').get(getFile);

module.exports = router;
