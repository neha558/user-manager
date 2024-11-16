import express from 'express';
import getUser from './getUsersSuggestionController';
import authenticateToken from '../../middleware/authentication';

const router = express.Router();

router.route('/').get(authenticateToken, getUser);

module.exports = router;
