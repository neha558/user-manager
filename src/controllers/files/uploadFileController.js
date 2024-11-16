import uploadFileService from 'services/file';
import logger from 'appConfig/logger';

const uploadFile = (req, res, next) => {
  if (req.files === undefined) {
    return res.status(400).json({ message: 'File not selected' });
  }
  const image = req.files.file;
  const path = `./uploads/${image.name}`;

  image.mv(path, (error) => {
    if (error) {
      next(error);
    }
    const data = {
      filePath: `${image.name}`,
    };
    logger.message(`Executing createUser controller`);
    uploadFileService
      .uploadFileService(data)
      .then((responseData) => {
        logger.message(`Executing createUser was successful`);
        res.status(201).json(responseData);
      })
      .catch((responseError) => {
        logger.message(
          `Error while executing file${responseError}`,
          'error',
        );
        next(error);
      });
  });
  return true;
};

export default uploadFile;
