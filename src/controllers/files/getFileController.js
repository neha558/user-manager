import uploadFileService from 'services/file';
import logger from 'appConfig/logger';
import fs from 'fs';

const getFile = (req, res, next) => {
  logger.message(`Executing getFile controller`);
  uploadFileService
    .getFileService(req.params.fileId)
    .then((responseData) => {
      logger.message(`Executing getFile was successful`);
      fs.readFile(
        `./uploads/${responseData.filePath}`,
        (error, content) => {
          if (error) {
            logger.message(
              `Unable to find File${error?.stack || error}`,
            );
            res.writeHead(400, { 'Content-type': 'text/html' });
            res.end('No such image');
          } else {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(content);
          }
        },
      );
    })
    .catch((error) => {
      logger.message(
        `Error while executing file${error?.stack || error}`,
        'error',
      );
      next(error);
    });
};

export default getFile;
