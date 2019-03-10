
 var canvas,ctx,zip;

 //Create a enum like object to easily reference desired platforms
 const osTypes={ios:"ios",android:"android"};
 Object.freeze(osTypes)
 var folders=[];


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
  //Triggered after file selected
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  //Reference an invisible element just to get the image accessable
    var img = document.getElementById("loadedimage");
    img.title = selectedFile.name;
  
    reader.onload = function(event) {
      img.src = event.target.result;
      ctx.drawImage(img,0,0,100,180);
       
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
  console.log(osTypes);
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