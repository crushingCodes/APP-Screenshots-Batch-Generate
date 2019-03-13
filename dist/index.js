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
