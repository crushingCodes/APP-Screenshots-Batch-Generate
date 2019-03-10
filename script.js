
 var canvas,ctx,zip;

 //Create a enum like object to easily reference desired platforms
 const osTypes={ios:"ios",android:"android"};
 Object.freeze(osTypes);
 const orientation={portrait:"portrait",landscape:"landscape"};
 Object.freeze(orientation);
 //  1242 x 2208 pixels (portrait)
    //  2208 x 1242 pixels (landscape
 const sizeProfiles={
   "portrait5.5": {height:2208,width:1242},
   "landscape5.5": {height:1242,width:2208}
};

 var images={};
 var folders={};


window.onload = function(){
  //Canvas should be loaded and ready to reference
    canvas = document.getElementById("previewCanvas");
    ctx = canvas.getContext("2d");
    ctx.moveTo(0, 0);
    //Get the canvas to init
    ctx.stroke();
    initZip();

};

function onFileSelected(event) {
  var targetWidth=0,targetHeight=0;
  //Triggered after file selected
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  //Reference an invisible element just to get the image accessable
    var img = document.getElementById("loadedimage");
    img.title = selectedFile.name;
  
    reader.onload = function(event) {
      img.src = event.target.result;
       
      var imageObject={fileName:img.title ,width:img.naturalWidth,height:img.naturalHeight};
      if(imageObject.width>=imageObject.height){
        imageObject["orientation"]=orientation.landscape;
        targetHeight=sizeProfiles["portrait5.5"].height;
        targetWidth=sizeProfiles["portrait5.5"].width;
      }else{
        imageObject["orientation"]=orientation.portrait;
        targetHeight=sizeProfiles["landscape5.5"].height;
        targetWidth=sizeProfiles["landscape5.5"].width;
      }

   // ctx.drawImage(img,0,0,100,180);
   ctx.height=targetHeight;
   ctx.width=targetWidth;
    ctx.drawImage(img,0,0,targetHeight,targetWidth);

      images[imageObject.fileName]=imageObject;
      console.log(images);
    };
  
    reader.readAsDataURL(selectedFile);
  }

function initZip(){
  //JSZip.js Library
   zip = new JSZip();
  zip.file("Hello.txt", "Thank you for using APP Screenshot Generator\n");
  initZipFolders();
}
function initZipFolders(){
//For each defined os defined u osTypes
  Object.entries(osTypes).forEach(os => {
    let value = os[1];
    folders[value]= zip.folder(value);

  })
}
function addToZip(imgName,imgUrl,osType){
  //Create the image file in the zip
  folders[osType].file(imgName, imgUrl.split('base64,')[1],{base64: true});

}
function downloadAsZip(){
var imgData = canvas.toDataURL();
addToZip("default.jpg",imgData,osTypes.android);
zip.generateAsync({type:"blob"})
.then(function(content) {
    // FileSaver.js Library
    saveAs(content, "screenshots.zip");
});
}