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


module.exports = {
    listOfImagesFromRequest,
    setFeatures,
    deleteFileInPublic
}