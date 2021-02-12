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

var resizeCropbox = false;
var nodes;
var cropBoxwidth = 50;
var cropBoxheight = 50;
var currentposycrop = 0,
  currentposxcrop = 0;
var initialposy, initialposx;
var xposOffset = 50;
var yposOffset = 50;
var currentposy = 0,
  currentposx = 0;
var posXpercentage, posYpercentage;
var heightPercentage, widthPercentage;
var actposXpercentage, actposYpercentage;
var actheightPercentage, actwidthPercentage;

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

      document.getElementById("CropperBody").style.display = "flex";
      document.getElementById("CropperImage").style.display = "flex";
    };
    img.onerror = function () {
      alert("not a valid file: " + file.type);
    };
    img.src = _URL.createObjectURL(file);
  } else {
    return;
  }
}
function getImageWidthWeightAspectratio(x) {
  // get the image and height of original image.
  Iheight = x.height;
  Iwidth = x.width;
  console.log(Iheight + " " + Iwidth);

  aspectRatio = Iheight / Iwidth;

  adjustWidthHeight();
}
function adjustWidthHeight() {
  // Adjust height and width of image according to viewport.

  VPwidth = window.innerWidth;
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
  createHtml();
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
    y >= VPwidth - cropBoxwidth - 4 ||
    x >= VPheight - cropBoxheight - 4
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
    initialposx = e.touches[0].clientX - xposOffset;
    initialposy = e.touches[0].clientY - yposOffset;
  } else {
    initialposx = e.clientX - xposOffset;
    initialposy = e.clientY - yposOffset;
  }
}

function resizeDrag(e) {
  if (resizeCropbox) {
    e.preventDefault();
    if (e.type === "touchmove") {
      currentposxcrop = e.touches[0].clientX - initialposx;
      currentposycrop = e.touches[0].clientY - initialposy;
    } else {
      currentposxcrop = e.clientX - initialposx;
      currentposycrop = e.clientY - initialposy;
    }
    xposOffset = currentposxcrop;
    yposOffset = currentposycrop;

    resizecroparea();
  }
}
function resizeEnd(e) {
  initialposx = currentposxcrop;
  initialposy = currentposycrop;
  resizeCropbox = false;
}

function resizecroparea() {
  if (
    currentposycrop >= VPwidth - 6 ||
    currentposxcrop >= VPheight - 6 ||
    currentposycrop <= 0 ||
    currentposxcrop <= 0 ||
    currentposycrop + currentposy >= VPwidth - 6 ||
    currentposxcrop + currentposx >= VPheight - 6
  ) {
    return;
  }
  cropBoxwidth = currentposxcrop;
  cropBoxheight = currentposxcrop;

  dragItem.style.width = cropBoxwidth + "px";
  dragItem.style.height = cropBoxheight + "px";
}
function getCropData() {
  posXpercentage = precentage(currentposx, VPheight);
  posYpercentage = precentage(currentposy, VPwidth);
  heightPercentage = precentage(cropBoxheight + currentposy, VPwidth);
  widthPercentage = precentage(cropBoxwidth + currentposx, VPheight);
  console.log(getExactcoordinates());
}

function precentage(val, total) {
  return (val / total) * 100;
}

function getExactcoordinates() {
  actposXpercentage = resolveprecentage(posXpercentage, Iwidth);
  actposYpercentage = resolveprecentage(posYpercentage, Iheight);
  actwidthPercentage = resolveprecentage(widthPercentage, Iwidth);
  actheightPercentage = resolveprecentage(heightPercentage, Iheight);
  var data = {
    left: actposXpercentage,
    top: actposYpercentage,
    bottom: actheightPercentage,
    right: actwidthPercentage,
  };

  return data;
}
function resolveprecentage(val, total) {
  return (total / 100) * val;
}

function createHtml() {
  var myvar =
    '<div class="CropperBody" id="CropperImage" style="z-index: 1"></div>' +
    '    <div class="CropperBody" id="CropperBody" style="z-index: 2">' +
    '      <div class="CropperContainer" id="CropperContainer">' +
    '        <div class="CropBox" id="cr" style="height: 50px; width: 50px">' +
    '          <div class="ResizeNodes rightNode" id="node"></div>' +
    "        </div>" +
    "      </div>" +
    "    </div>";
    var cropbody1 = document.createElement("div");
    cropbody1.setAttribute("class","CropperBody");
    
    cropbody1.setAttribute("style","z-index:1");
    document.body.appendChild(cropbody1)

}

$(document).ready(function () {
  $("#save").click(function () {
    var cdata = getExactcoordinates();

    var fd = new FormData();
    fd.append("file", $("#pimagefile").prop("files")[0]);
    fd.append("cdata", JSON.stringify(cdata));

    $.ajax({
      url: "/api",
      type: "POST",
      contentType: "multipart/form-data",
      contentType: false,
      processData: false,
      data: fd,
      beforeSubmit: function () {},
      success: function (data) {
        if (data.status == "1") {
        } else {
        }
      },
      error: function () {},
    });
  });
});
