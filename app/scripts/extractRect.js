const cv = require("opencv4nodejs");
const process = require("process");
const path = require("path");
const fs = require("fs");

const RED = new cv.Vec(0, 0, 255);
const shouldWriteOutput = false;

// [ '/usr/local/bin/node',
//   'extractReact.js',
//   '/tmp/fun.drafter/test.png' ]
const targetFilePath = process.argv[2];

const src = cv.imread(targetFilePath);
const gray = src.cvtColor(cv.COLOR_RGBA2GRAY);
const canny = gray.canny(0, 30);
const dilate = canny.dilate(
  cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(20, 20))
);
let contours = dilate.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

if (shouldWriteOutput) {
  for (let i = 0; i < contours.length; i++) {
    const contour = contours[i];

    const rect = contour.boundingRect();
    src.drawRectangle(rect, RED, 2);
  }
}

// output contours data to file as tree data.
contours = contours.map(v => v.boundingRect());

fs.writeFileSync(targetFilePath.replace(path.extname(targetFilePath), '_bouding.json'), JSON.stringify({
  size: src.sizes,
  contours: contours,
}, null, 2));

if (shouldWriteOutput) {
  cv.imwrite(targetFilePath.replace(path.extname(targetFilePath), `_bouding.${path.extname(targetFilePath)}`), src);
}