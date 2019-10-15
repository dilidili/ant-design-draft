const cv = require("opencv4nodejs");

const White = new cv.Vec(255, 255, 255);

const ButtonType = 1;
const CheckboxType = 2;
const InputType = 3;
const LabelType = 4;

const LabelMode = 0b0001;
const NoMode = 0b0000;

const containRect = (a, b) => {
  return b.x >= a.x && b.y >= a.y && (b.x + b.width) <= (a.x + a.width) && (b.y + b.height) <= (a.y + a.height);
}

const isEqualRect = (a, b) => {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

const classifyType = (forItemContours, canny, contours, isDebug) => {
  const types = new Array(forItemContours.length).fill(InputType);
  const modes = new Array(forItemContours.length).fill(NoMode);

  // Detect text content.
  const hists = forItemContours.map((contour, index) => {
    const mask = new cv.Mat(canny.rows, canny.cols, canny.type, 0);
    const padding = 2;
    const stripBorder = new cv.Rect(contour.x + padding, contour.y + padding, contour.width - 2 * padding, contour.height - 2 * padding);
    mask.drawRectangle(stripBorder, White, cv.FILLED);
    const hist = cv.calcHist(canny, [{
      channel: 0,
      bins: 2,
      ranges: [0, 256],
    }], mask)

    if (isDebug) {
      cv.imwrite(`label${index}.png`, mask);
    }

    const hData = hist.getDataAsArray();
    return hData[1][0] / hData[0][0];
  });

  forItemContours.forEach((contour, index) => {
    let childrenContour = contours.filter(v => !isEqualRect(contour, v) && containRect(contour, v));
    childrenContour = childrenContour.filter(v => v.x - contour.x + v.y - contour.y + contour.height - v.height + contour.width - v.width > 20);
    childrenContour = childrenContour.filter(v => !childrenContour.some(w => !isEqualRect(w, v) && containRect(w, v)));
    const childrenContourAbsolute = childrenContour;
    childrenContour = childrenContour.map(v => {
      return new cv.Rect(v.x - contour.x, v.y - contour.y, v.width, v.height)
    });

    // const crop = canny.getRegion(contour);
    // for (let i = 0; i < childrenContour.length; i++) {
    //   const contour = childrenContour[i];
    //   crop.drawRectangle(contour, White, 1);
    // }
    // cv.imwrite(`test${index}.png`, crop);

    // Label type or checkbox.
    if (hists[index] > 0.1) {
      if (childrenContour.length > 1) {
        types[index] = CheckboxType;
      } else {
        types[index] = LabelType;
      }

      return;
    }

    const col = contour.width / 24;
    const layout = childrenContour.map((child) => {
      const span = Math.round(child.width / col);
      const offset = Math.round(child.x / col);

      return {
        span,
        offset,
      }
    });

    if (childrenContour.length === 1) {
      const leftPadding = layout[0].offset;
      const rightPadding = 24 - layout[0].offset - layout[0].span;

      // Button type.
      if (Math.abs(leftPadding - rightPadding) <= 1) {
        types[index] = ButtonType;
        return;
      }

      // Input type with placeholder.
      if (layout[0].offset <= 2) {
        types[index] = InputType;
        return;
      }
    }

    if (childrenContour.length === 2) {
      // Labeled form item.
      if (Math.abs(layout[0].offset + layout[0].span - layout[1].offset) <= 1) {
        modes[index] = modes[index] | LabelMode;

        const subTypes = classifyType([childrenContourAbsolute[1]], canny, contours);

        // const subItem = canny.getRegion(childrenContourAbsolute[1]);
        // cv.imwrite(`sub${index}.png`, subItem);

        types[index] = subTypes[0].type;
        return;
      }
    }
  });

  const ret = types.map((type, index) => {
    return {
      type,
      mode: modes[index],
    }
  });

  return ret;
};

module.exports = {
  containRect,
  classifyType,
  isEqualRect,
};