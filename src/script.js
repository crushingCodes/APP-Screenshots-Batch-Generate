
var canvas, ctx;
var zip;
var imgElement;
var imgTargetId;
var images;
var folders = {};

//Create a enum like object to easily reference desired platforms
const osTypes = { ios: "ios", android: "android" };
Object.freeze(osTypes);
const orientation = { portrait: "portrait", landscape: "landscape" };
Object.freeze(orientation);
//  1242 x 2208 pixels (portrait)
//  2208 x 1242 pixels (landscape
const sizeProfiles = {
  "5.5": { sizeName:"5.5inch", pHeight: 2208, pWidth: 1242, lHeight: 1242, lWidth: 2208,platform:osTypes.ios},
};




window.onload = function () {
  images = {};


  //Canvas should be loaded and ready to reference
  canvas = document.getElementById("previewCanvas");
  ctx = canvas.getContext("2d");
  //Get the canvas to init
  ctx.stroke();
  //Reference an element just to get the image accessable to draw on canvas
  imgElement = document.getElementById("loadedimage");
  initZip();

};

function imgRendered() {
  //Render complete
  drawImage();
}

function startImgRender() {
  //Rendering start
  requestAnimationFrame(imgRendered);
}

function imgLoaded() {
  //Initail Image Loaded
  requestAnimationFrame(startImgRender);
}

function onFileSelected(file) {
  //Triggered after file selected
  var reader = new FileReader();
  var input = file.target;
  reader.onload = function (event) {
    var dataURL = reader.result;

    imgElement.src = dataURL;

    //Check image is finished loading before allowing to prevent race conditions
    imgElement.onload = function () {
      imgLoaded()
      var imageObject = { fileName: imgElement.title, width: imgElement.naturalWidth, height: imgElement.naturalHeight };
      imgTargetId = imageObject.fileName;

      images[imageObject.fileName] = imageObject;
      console.log(images);
    };
    imgElement.onerror = function () {
      console.log("FAILED to load Image");

    };
  }
  reader.readAsDataURL(input.files[0]);

}

function drawImage() {
  var imageObject = images[imgTargetId];
  var targetWidth = 0, targetHeight = 0;

  if (imageObject.width >= imageObject.height) {
    imageObject["orientation"] = orientation.landscape;
    targetHeight = sizeProfiles["5.5"].lHeight;
    targetWidth = sizeProfiles["5.5"].lWidth;

  } else {
    imageObject["orientation"] = orientation.portrait;
    targetHeight = sizeProfiles["5.5"].pHeight;
    targetWidth = sizeProfiles["5.5"].pWidth;
  }
  canvas.height = targetHeight;
  canvas.width = targetWidth;
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  //Try force a canvas update
  ctx.stroke();
  
}



function initZip() {
  //JSZip.js Library
  zip = new JSZip();
  zip.file("Hello.txt", "Thank you for using APP Screenshot Generator\n");
  initZipFolders();
}
function initZipFolders() {
  //For each defined os defined u osTypes
  Object.entries(osTypes).forEach(os => {
    let value = os[1];
    folders[value] = zip.folder(value);

  })
}
function addToZip(imgName, imgUrl, osType) {
  //Create the image file in the zip
  folders[osType].file(imgName, imgUrl.split('base64,')[1], { base64: true });

}
function downloadAsZip() {
  var imgData = canvas.toDataURL();
  //For now just add one file to zip before downloading
  addToZip("default.jpg", imgData, osTypes.ios);
  zip.generateAsync({ type: "blob" })
    .then(function (content) {
      // FileSaver.js Library
      saveAs(content, "screenshots.zip");
    });
}