//Declare global variables
let canvas, ctx, zip, imgElement, imgTargetId, images = {}, folders = {};

//Create a enum like object to easily reference desired platforms
const osTypes = { ios: "ios", android: "android" };
Object.freeze(osTypes);
const orientation = { portrait: "portrait", landscape: "landscape" };
Object.freeze(orientation);

//Preset Config sizes for regular and large screens for ios and android
const sizeProfilesConfig = {
  "5.5": { sizeName: "5.5inch", pHeight: 2208, pWidth: 1242, lHeight: 1242, lWidth: 2208, platform: osTypes.ios },
  "6.5": { sizeName: "6.5inch", pHeight: 2688, pWidth: 1242, lHeight: 1242, lWidth: 2688, platform: osTypes.ios },
  "10.5": { sizeName: "10.5inch", pHeight: 2224, pWidth: 1668, lHeight: 1668, lWidth: 2224, platform: osTypes.ios },
  "5.1": { sizeName: "5.1inch", pHeight: 1280, pWidth: 800, lHeight: 800, lWidth: 1280, platform: osTypes.android },
  "10": { sizeName: "10inch", pHeight: 2560, pWidth: 1700, lHeight: 1700, lWidth: 2560, platform: osTypes.android },
};

window.onload = function () {
  //Canvas should be loaded and ready to reference
  canvas = document.getElementById("previewCanvas");
  ctx = canvas.getContext("2d");
  //Get the canvas to init
  ctx.stroke();
  //Reference an element just to get the image accessable to draw on canvas
  imgElement = document.getElementById("loadedimage");
  initZip();
};

function initZip() {
  //JSZip.js Library
  zip = new JSZip();
  zip.file("Hello.txt", "Thank you for using APP Screenshot Generator\n" +
    "Please find updates at https://github.com/crushingCodes/APP-Screenshots-Batch-Generate\n");
  initZipFolders();
}
function initZipFolders() {
  //For each defined os defined osTypes
  Object.entries(osTypes).forEach(os => {
    let value = os[1];
    folders[value] = zip.folder(value);
  })
  //Create subdir for size profiles
  Object.entries(sizeProfilesConfig).forEach(size => {
    let sizeProfile = size[1];
    folders[sizeProfile.platform][sizeProfile.sizeName] = zip.folder(sizeProfile.platform + "/" + sizeProfile.sizeName);
  })
}

function onFileSelected(file) {
  //Triggered after file selected
  let reader = new FileReader();
  let input = file.target;
  reader.onload = function (event) {
    let dataURL = reader.result;
    imgElement.src = dataURL;
    //Check image is finished loading before allowing to prevent race conditions
    imgElement.onload = function () {
      let fileName = input.files[0].name;
      //There is now a valid image, check the correct class on error div
      toggleDispayClassOn("error-no-img", false);
      //Add list item in html
      if (!images[fileName]) {
        addListElement(fileName);
      }
      imgLoaded()
      let imageObject = { fileName: fileName, width: imgElement.naturalWidth, height: imgElement.naturalHeight };
      imgTargetId = imageObject.fileName;
      images[imageObject.fileName] = imageObject;
      console.log("Loaded images", images);
    };
    imgElement.onerror = function () {
      console.log("FAILED to load Image");
    };
  }
  reader.readAsDataURL(input.files[0]);
}

function startImgRender() {
  //Rendering start
  requestAnimationFrame(imgRendered);
}
function imgLoaded() {
  //Initail Image Loaded
  requestAnimationFrame(startImgRender);
}
function imgRendered() {
  //Render complete
  //Iterate size profiles and draw for each
  Object.entries(sizeProfilesConfig).forEach(size => {
    let key = size[0];
    drawImage(key);
  });
}
function drawImage(targetSizeId) {
  //Temp targetSizeId variable until selection choices created
  let imageObject = images[imgTargetId];
  let targetWidth = 0, targetHeight = 0;

  //Automatically decides whether image is portrait or landscape based on input
  if (imageObject.width >= imageObject.height) {
    imageObject["orientation"] = orientation.landscape;
    targetHeight = sizeProfilesConfig[targetSizeId].lHeight;
    targetWidth = sizeProfilesConfig[targetSizeId].lWidth;

  } else {
    imageObject["orientation"] = orientation.portrait;
    targetHeight = sizeProfilesConfig[targetSizeId].pHeight;
    targetWidth = sizeProfilesConfig[targetSizeId].pWidth;
  }
  canvas.height = targetHeight;
  canvas.width = targetWidth;
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  //Try force a canvas update
  ctx.stroke();
  //Save image to zip so another image can be loaded
  let imgData = canvas.toDataURL();
  addToZip(images[imgTargetId].fileName, imgData, sizeProfilesConfig[targetSizeId]);
}
function addToZip(imgName, imgUrl, sizeProfile) {
  //Create a ref to delete later if needed
  //Create the image file in the zip

  folders[sizeProfile.platform][sizeProfile.sizeName].file(imgName, imgUrl.split('base64,')[1], { base64: true });
}
function onDeleteClick(fileName) {
  console.log("Delete ", fileName)
  //Remove item from list view
  let listItem = document.getElementById(fileName);
  listItem.remove();
  //Remove the item the same way it was created
  Object.entries(sizeProfilesConfig).forEach(size => {
    let targetSizeId = size[0];
   removeFromZip(images[imgTargetId].fileName, sizeProfilesConfig[targetSizeId]);
  })
    //Remove from stored images object
  delete images[fileName];
}
function removeFromZip(imgName, sizeProfile) {
  //Delete item from zip
  folders[sizeProfile.platform][sizeProfile.sizeName].remove(imgName);
}
function addListElement(label) {

  let listParent = document.getElementById("imageListParent");
  let listItem = document.createElement('LI');
  //Add label to id so we can find it easily later to delete
  listItem.setAttribute("id",label);
  let listItemLabel = document.createTextNode(label);

  listItem.classList.add("list-group-item");

  listItem.appendChild(listItemLabel);

  let listSpan = document.createElement('span')
  listSpan.classList.add("pull-right");
  listSpan.classList.add("button-group");
  let tempLabel = "'" + label + "'";
  //Add dynamic functions to each created button
  listSpan.innerHTML = '<button class="btn btn-outline-primary btn-sm"' +
    '" onclick="onDeleteClick(' + tempLabel + ')"><span class="glyphicon glyphicon-remove"></span></button>';
  listItem.appendChild(listSpan)
  listParent.appendChild(listItem);
}

function downloadAsZip() {
  console.log(images);
  //Check for empty images object
  //NOTE supported by ECMA 5+
  if (Object.keys(images).length === 0 && images.constructor === Object) {
    toggleDispayClassOn("error-no-img", true);
  } else {
    //Contains valid image, clear to proceed with download
    zip.generateAsync({ type: "blob" })
      .then(function (content) {
        // FileSaver.js Library
        saveAs(content, "screenshots.zip");
      });
  }


}
function toggleDispayClassOn(idName, value) {
  let element = document.getElementById(idName);
  if (value) {
    element.classList.remove("display-off");
    element.classList.add("display-on");
  } else {
    element.classList.remove("display-on");
    element.classList.add("display-off");
  }
}
