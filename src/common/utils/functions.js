const path = require("path")
const fs = require("fs")

function listOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
      return files.map((file) => {
        const filePath = path.join(fileUploadPath, file.filename);
        return filePath.replace(/\\/g, '/');
      });
    } else {
      return [];
    }
  }

function setFeatures(body) {
    const { colors, width, weight, height, length } = body;
    let features = {};
    features.colors = colors;
    if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
        if (!width) features.width = 0;
        else features.width = +width;
        if (!height) features.height = 0;
        else features.height = +height;
        if (!length) features.length = 0;
        else features.length = +length;
    }
    return features
}

function deleteFileInPublic(fileAddress) {
    if (fileAddress) {
        const pathFile = path.join(__dirname, "..", "..", "public", fileAddress)
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
}
const removePropertyInObject = (target = {}, properties = []) => {
  // Check if target is a valid object
  if (typeof target !== 'object' || target === null) {
      throw new Error('Target must be a non-null object');
  }

  // Check if properties is a valid array
  if (!Array.isArray(properties)) {
      throw new Error('Properties must be an array of strings');
  }

  for (const property of properties) {
      if (target.hasOwnProperty(property)) {
          delete target[property];
      }
  }

  return target;
};

const stringToArray = (...fields) => (req, res, next) => {
  fields.forEach(field => {
    if (req.body[field]) {
      if (typeof req.body[field] === 'string') {
        req.body[field] = req.body[field]
          .split(/[#,\s]+/) // Split by #, , or any whitespace
          .filter(item => item) // Remove empty strings
          .map(item => item.trim()); // Trim whitespace from each item
      }
      if (Array.isArray(req.body[field])) {
        req.body[field] = [...new Set(req.body[field].map(item => item.trim()))]; // Trim and remove duplicates
      }
    } else {
      req.body[field] = [];
    }
  });
  next();
};
module.exports = {
    listOfImagesFromRequest,
    setFeatures,
    deleteFileInPublic,
    stringToArray,
    removePropertyInObject
}