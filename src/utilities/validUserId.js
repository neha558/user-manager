import models from 'models';

const validUserId = (userId) => models.User.findByPk(userId);

export default validUserId;
