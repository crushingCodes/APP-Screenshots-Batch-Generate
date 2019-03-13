const OutputFolder = './screensOut/';
const inputFolder = './screensIn/';
;
//interface ImagesObject {fileName:FileName,imageObj:ImageObject};
let testInputProfile = { width: 300, height: 200 };
//console.log(getInputDimensions(testInputProfile));
function getInputDimensions(width, height) {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions;
    if (width >= height) {
        dimensions = { width: width, height: height, orientation: "landscape" };
    }
    else {
        dimensions = { width: width, height: height, orientation: "portrait" };
    }
    return dimensions;
}
/*
var sizeOf = require('image-size');

sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
*/
getImageInpObjects();
function getImageInpObjects() {
    const fs = require('fs');
    const resizeImg = require('resize-img');
    let sizeOf = require('image-size');
    let inpImgPath = "";
    let outImgDir = "";
    let outImgPath = "";
    let dimensionsIn;
    const mkdirp = require('mkdirp');
    outImgDir = OutputFolder + "size1/";
    mkdirp(outImgDir, function (err) {
        if (err)
            console.error(err);
        else
            console.log('pow!');
    });
    //let newImageObj:ImageObject;
    let newImagesObj = {};
    fs.readdirSync(inputFolder).forEach(file => {
        inpImgPath = inputFolder + file;
        dimensionsIn = sizeOf(inpImgPath);
        //console.log(dimensionsIn.width, dimensionsIn.height);
        let newImageObj = {};
        newImageObj = { fileName: file, dimensions: getInputDimensions(dimensionsIn.width, dimensionsIn.height) };
        newImagesObj[file] = newImageObj;
        outImgPath = outImgDir + file;
        processImage(inpImgPath, outImgPath);
        // resizeImg(fs.readFileSync(inpImgPath), {width: 128, height: 128}).then(buf => {
        //     fs.writeFileSync(outImgPath, buf);
        // });
        //  console.log(newImageObj);
    });
    console.log(newImagesObj);
    return newImagesObj;
}
function processImage(inpImgPath, outImgPath) {
    const fs = require('fs');
    const resizeImg = require('resize-img');
    resizeImg(fs.readFileSync(inpImgPath), { width: 128, height: 128 }).then(buf => {
        fs.writeFileSync(outImgPath, buf);
    });
}
