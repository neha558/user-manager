const { IMAGE_SIZE } = require('utils/constants');

const uploadFileSchema = {
  files: (req) => {
    const file = req.files.file.size;
    if (!file) {
      return { error: 'Please upload file' };
    }
    if (file.size > IMAGE_SIZE) {
      return { error: 'file size cannot be greater than 2MB' };
    }
    return { message: 'File has been validated successfully' };
  },
};

export default uploadFileSchema;
