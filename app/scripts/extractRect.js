const cv = require("opencv4nodejs");
const process = require("process");
const path = require("path");
const fs = require("fs");
const exec = require('child_process').exec;
const { classifyType, containRect, isEqualRect } = require("./classifyType");

const RED = new cv.Vec(0, 0, 255);

// [ '/usr/local/bin/node',
//   'extractReact.js',
//   '/tmp/fun.drafter/test.png',
//   1,
// ]
const targetFilePath = process.argv[2];
const isDebug = process.argv[3] == '1';

if (process.argv[3] === '2') {
  exec('rm *.png');
  exec('rm *.json');
}

const src = cv.imread(targetFilePath);
const blur = src.gaussianBlur(new cv.Size(5, 5), 0);
const gray = blur.cvtColor(cv.COLOR_RGBA2GRAY);
const canny = gray.canny(0, 100);

if (isDebug) {
  cv.imwrite('canny.png', canny);
}

const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(15, 5));
const dilate = canny.morphologyEx(
  kernel,
  cv.MORPH_CLOSE,
);

if (isDebug) {
  cv.imwrite('dilate.png', dilate);
}

let contours = dilate.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

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

// filter outer contour.
contours = contours.filter(v => v.x + v.y + src.sizes[0] - v.height + src.sizes[1] - v.width > 20);

// remove duplicated contours.
contours = contours.filter((v, index) => contours.findIndex(w => isEqualRect(w, v)) === index);

// filter form items which is direct a child contour of the root.
let formItemContours = contours.filter(v => !contours.some(w => !isEqualRect(v, w) && containRect(w, v)));

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
  while (true) {
    const toBeMerged = merged.find(v => {
      const distance = v.x - (newContour.x + newContour.width);
      return distance >= 0 && distance < width * 0.1;
    });

    if (toBeMerged) {
      newContour = new cv.Rect(
        newContour.x,
        Math.min(toBeMerged.y, newContour.y),
        toBeMerged.x + toBeMerged.width - newContour.x,
        Math.max(toBeMerged.y + toBeMerged.height, newContour.y + newContour.height) - Math.min(toBeMerged.y, newContour.y)
      );

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
formItemContours = formItemContours.filter(v => !formItemContours.some(w => v !== w && containRect(w, v)));

if (isDebug) {
  for (let i = 0; i < formItemContours.length; i++) {
    const contour = formItemContours[i];

    src.drawRectangle(contour, RED, 1);
  }

  cv.imwrite('contour.png', src);
}

const types = classifyType(formItemContours, canny, contours, isDebug);
if (isDebug) {
  console.log(types);
}
const bounding = formItemContours.map((v, index) => {
  const type = types[index];
  return {
    ...v,
    ...type,
  };
});

if (isDebug) {
  fs.writeFileSync('bouding.json', JSON.stringify({
    size: src.sizes,
    contours: bounding,
  }, null, 2));
} else {
  fs.writeFileSync(targetFilePath.replace(path.extname(targetFilePath), '_bouding.json'), JSON.stringify({
    size: src.sizes,
    contours: bounding,
  }, null, 2));
}