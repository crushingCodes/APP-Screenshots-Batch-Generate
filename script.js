
 var canvas;
 var ctx;

 var zip;
 var osTypes=[{"ios":"ios"},{"android":"android"}];
 var folders;
console.log("Hello World");


window.onload = function(){
  //Canvas should be loaded and ready to reference
    canvas = document.getElementById("previewCanvas");
    ctx = canvas.getContext("2d");
    ctx.moveTo(0, 0);
    //Get the canvas to init
    ctx.stroke();

};
    //downloadLnk.addEventListener('click', download, false);
  //   function download() {
  //     var dt = canvas.toDataURL('image/jpeg');
  //     this.href = dt;
  // };

function onFileSelected(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  
    var img = document.getElementById("loadedimage");
    img.title = selectedFile.name;
  
    reader.onload = function(event) {
      img.src = event.target.result;

      //ctx.drawImage(imgtag, 0, 0);
      ctx.drawImage(img,0,0,100,180);
      addToZip(img,"default",osTypes["android"]);
      downloadAsZip();
    };
  
    reader.readAsDataURL(selectedFile);
  }

function initZip(){
  //JSZip.js Library
   zip = new JSZip();
  zip.file("Hello.txt", "Thank you for using APP Screenshot Generator\n");
 //  imgFolder = zip.folder("images");
  initZipFolders();
}
function initZipFolders(){
  for(var os of osTypes){
    folders[os]= zip.folder(osTypes);
  }
}
function addToZip(imgData,imgName,osType){
  folders[osType].file(imgName, imgData, {base64: true});

}
function downloadAsZip(){

//img.file("smile.gif", imgData, {base64: true});

zip.generateAsync({type:"blob"})
.then(function(content) {
    // FileSaver.js Library
    saveAs(content, "screenshots.zip");
});
}