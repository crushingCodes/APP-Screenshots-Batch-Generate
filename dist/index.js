let testInputProfile = { width: 300, height: 200 };
console.log(getInputDimensions(testInputProfile));
function getInputDimensions(inputProfile) {
    //Give input dimensions and return dimensions with correct size and orientation
    let dimensions;
    if (inputProfile.width >= inputProfile.height) {
        dimensions = { width: inputProfile.width, height: inputProfile.height, orientation: "landscape" };
    }
    else {
        dimensions = { width: inputProfile.width, height: inputProfile.height, orientation: "portrait" };
    }
    return dimensions;
}
/*
var sizeOf = require('image-size');

sizeOf('images/funny-cats.png', function (err, dimensions) {
  console.log(dimensions.width, dimensions.height);
});
*/
const pkgDir = require('pkg-dir');
(async () => {
    const rootDir = await pkgDir("screensIn");
    console.log(rootDir);
    //=> '/Users/sindresorhus/foo'
})();
