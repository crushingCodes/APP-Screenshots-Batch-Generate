let testInputProfile = { size1: 100, size2: 200 };
console.log(getInputDimensions(testInputProfile));
function getInputDimensions(inputProfile) {
    //Give input dimensions and return dimensions with correct size and orientation
    var dimensions;
    if (inputProfile.size1 >= inputProfile.size2) {
        dimensions = { width: inputProfile.size1, height: inputProfile.size2, orientation: "portrait" };
    }
    else {
        dimensions = { width: inputProfile.size1, height: inputProfile.size2, orientation: "landscape" };
    }
    return dimensions;
}
