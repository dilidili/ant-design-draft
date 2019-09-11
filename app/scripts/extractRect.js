const cv = require("opencv4nodejs");
const process = require("process");
const path = require("path");
const fs = require("fs");
const classifyType = require("./classifyType");

const RED = new cv.Vec(0, 0, 255);
const shouldWriteOutput = false;

// [ '/usr/local/bin/node',
//   'extractReact.js',
//   '/tmp/fun.drafter/test.png' ]
const targetFilePath = process.argv[2];

const src = cv.imread(targetFilePath);
const gray = src.cvtColor(cv.COLOR_RGBA2GRAY);
const canny = gray.canny(0, 100);
const dilate = canny.dilate(
  cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(10, 10))
);
let contours = dilate.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

if (shouldWriteOutput) {
  for (let i = 0; i < contours.length; i++) {
    const contour = contours[i];

    const rect = contour.boundingRect();
    src.drawRectangle(rect, RED, 2);
  }
}

// utils
const containRect = (a, b) => {
  return b.x >= a.x && b.y >= a.y && (b.x + b.width) <= (a.x + a.width) && (b.y + b.height) <= (a.y + a.height);
}

// e.g.:  | |,  | |
//        |       |
const inSameRow = (a, b) => {
  if (a.y > b.y) {
    return a.y - b.y < b.height;
  } else {
    return b.y - a.y < a.height; 
  }
}

contours = contours.map(v => v.boundingRect());

// filter the form item which is direct child contour.
let formItemContours = contours.filter(v => !contours.some(w => v !== w && containRect(w, v)));

// merge form items parts.
let i = 0;
while (i < formItemContours.length) {
  if (!formItemContours[i]) {
    i++;
    continue;
  }

  // filter items which in same row.
  merged = formItemContours.filter((v) => !!v && inSameRow(formItemContours[i], v));
  merged = merged.sort((a, b) => a.x - b.x);
  const width = merged[merged.length - 1].x + merged[merged.length - 1].width - merged[0].x;

  let newContour = formItemContours[i];
  while(true) {
    const toBeMerged = merged.find(v => {
      const distance = v.x - (newContour.x + newContour.width);
      return distance > 0 && distance < width * 0.05;
    });

    if (toBeMerged) {
      newContour = {
        ...newContour,
        width: toBeMerged.x + toBeMerged.width - newContour.x,
        y: Math.min(toBeMerged.y, newContour.y),
        height: Math.max(toBeMerged.y + toBeMerged.height, newContour.y + newContour.height) - Math.min(toBeMerged.y, newContour.y),
      }

      const toBeMergedIndex = formItemContours.indexOf(toBeMerged);
      merged = merged.filter(v => v !== toBeMerged);
      formItemContours[toBeMergedIndex] = null;
    } else {
      break;
    }
  }

  formItemContours[i] = newContour;
  i++;
}
formItemContours = formItemContours.filter(v => !!v);

// filter form item direct children.
formItemContours = formItemContours.map(v => {
  v.children = contours.filter(w => v !== w && containRect(v, w));
  v.children = v.children.map(v => ({ ...v }));
  return v;
})

formItemContours = formItemContours.map(v => classifyType(v));

fs.writeFileSync(targetFilePath.replace(path.extname(targetFilePath), '_bouding.json'), JSON.stringify({
  size: src.sizes,
  contours: formItemContours,
}, null, 2));

if (shouldWriteOutput) {
  cv.imwrite(targetFilePath.replace(path.extname(targetFilePath), `_bouding.${path.extname(targetFilePath)}`), src);
}