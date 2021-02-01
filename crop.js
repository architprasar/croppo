// crop
var Iheight, Iwidth;
var VPheight, VPwidth;
var _URL = window.URL || window.webkitURL;
var aspectRatio;
var file, img;
var dragItem;
var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var xDistance, yDistance;
var boxHeight, boxWidth;
var resizeCropbox = false;
var nodes;
var cropBoxwidth = 50;
var cropBoxheight = 50;
var cropBoxXcordinate = 0;
var cropBoxYcordinate = 0;
var initialposy, initialposx;
var xposOffset = 50;
var yposOffset = 50;
var currentposy, currentposx;

//event listners
window.addEventListener("load", setOnload);
window.addEventListener("touchstart", cropStart, false);
window.addEventListener("touchend", cropEnd, false);
window.addEventListener("touchmove", cropDrag, false);

window.addEventListener("mousedown", cropStart, false);
window.addEventListener("mouseup", cropEnd, false);
window.addEventListener("mousemove", cropDrag, false);

function setOnload() {
  dragItem = document.getElementById("cr");
  nodes = document.getElementById("node");
}

function collectimage(x) {
  if ((file = x.files[0])) {
    img = new Image();
    img.onload = function () {
      getImageWidthWeightAspectratio(img);
    };
    img.onerror = function () {
      alert("not a valid file: " + file.type);
    };
    img.src = _URL.createObjectURL(file);
  } else {
    return;
  }
  document.getElementById("CropperBody").style.display = "flex";
  document.getElementById("CropperImage").style.display = "flex";
}
function getImageWidthWeightAspectratio(x) {
  // get the image and height of original image.
  Iheight = x.height;
  Iwidth = x.width;
  console.log(Iheight +" "+Iwidth);
  aspectRatio = Iheight / Iwidth;
  adjustWidthHeight();
}
function adjustWidthHeight() {
  // Adjust height and width of image according to viewport.

  VPwidth = window.innerWidth / 3;
  console.log(VPwidth);
  VPheight = VPwidth / aspectRatio;
  createImage();
}
function createImage() {
  // preview the adjusted image.
  var style = "width:" + VPheight + "px;height:" + VPwidth + "px;";

  var container = document.getElementById("CropperContainer");
  var bdy = document.getElementById("CropperImage");
  container.setAttribute("style", style);
  var img1 = new Image(VPheight, VPwidth);
  img1.src = _URL.createObjectURL(file);
  bdy.appendChild(img1);
}

function createCropCropBoxContainer(height, width) {
  // CropperContainer class
  var style = "width:" + width + "px;height:" + height + "px;";
  var container = document.createElement("div");
  container.setAttribute("class", "CropperContainer");
  container.setAttribute("style", style);
  document.getElementById("CropperBody").appendChild(container);
}

function cropStart(e) {
  resizeStart(e);
  if (e.target != dragItem) {
    if (e.target === nodes) {
      return;
    }
    return;
  }
  active = true;
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }
}

function cropEnd(e) {
  resizeEnd(e);
  initialX = currentX;
  initialY = currentY;
  active = false;
}

function cropDrag(e) {
  resizeDrag(e);
  if (active) {
    e.preventDefault();
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }
    xOffset = currentX;
    yOffset = currentY;

    setPosition(currentX, currentY, dragItem);
  }
}



function setPosition(x, y, cropbox) {
  if (
    x < 0 ||
    y < 0 ||
    y >= VPwidth - cropBoxwidth ||
    x >= VPheight - cropBoxheight
  ) {
    return;
  }
  currentposy = y;
  currentposx = x;
  getCropData();
  cropbox.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
}

function resizeStart(e) {
  if (e.target != nodes) {
    return;
  }
  resizeCropbox = true;
  if (e.type === "touchstart") {
    initialposx = e.touches[0].clientX;
    initialposy = e.touches[0].clientY;
  } else {
    initialposx = e.clientX - xposOffset;
    initialposy = e.clientY - yposOffset;
  }
}

function resizeDrag(e) {
  if (resizeCropbox) {
    e.preventDefault();
    if (e.type === "touchmove") {
      currentposx = e.touches[0].clientX - initialposx;
      currentposy = e.touches[0].clientY - initialposy;
    } else {
      currentposx = e.clientX - initialposx;
      currentposy = e.clientY - initialposy;
    }
    xposOffset = currentposx;
    yposOffset = currentposy;

    resizecroparea();
  }
}
function resizeEnd(e) {
  initialposx = currentposx;
  initialposy = currentposy;
  resizeCropbox = false;
}

function resizecroparea() {
  if (
    currentposy >= VPwidth ||
    currentposx >= VPheight ||
    currentposy <= 0 ||
    currentposx <= 0
  ) {
    return;
  }
  cropBoxwidth = currentposx;
  cropBoxheight = currentposx;
  console.log(currentposx + " " + currentposy);
  dragItem.style.width = cropBoxwidth + "px";
  dragItem.style.height = cropBoxheight + "px";
}
function getCropData() {
  var posXpercentage, posYpercentage;
  var heightPercentage, widthPercentage;
  posXpercentage = precentage(currentposx, VPheight);
  posYpercentage = precentage(currentposy, VPwidth);
  heightPercentage = precentage(cropBoxheight, VPwidth);
  widthPercentage = precentage(cropBoxwidth, VPheight);
  getExactcoordinates(
    posXpercentage,
    posYpercentage,
    heightPercentage,
    widthPercentage
  );
}

function precentage(val, total) {
  return (val / total) * 100;
}

function getExactcoordinates(x, y, h, w) {
  var actposXpercentage, actposYpercentage;
  var actheightPercentage, actwidthPercentage;
  actposXpercentage = resolveprecentage(x, Iwidth);
  actposYpercentage = resolveprecentage(y, Iheight) ;
  actwidthPercentage = resolveprecentage(w, Iwidth)+ actposXpercentage ;
  actheightPercentage = resolveprecentage(h, Iheight) + actposYpercentage;
  console.log(
    actposXpercentage +
      " " +
      actposYpercentage +
      " " +
      actheightPercentage +
      " " +
      actwidthPercentage
  );
}
function resolveprecentage(val, total) {
  return (total / 100) * val;
}
