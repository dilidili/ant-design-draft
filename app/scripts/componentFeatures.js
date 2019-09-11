const getFeatures = (contour) => {
  const features = contour.children.sort((a, b) => {
    return a.width * a.height - b.width * b.height;
  }).map(child => {
    child.fCenter = [(child.x + child.width / 2) / contour.width, (child.y + child.height / 2) / contour.height];
    child.fWidth = child.width / contour.width;
    child.fHeight = child.height / contour.width;
    return child;
  });

  return features;
};

const distanceBetween = (a, b) => {
  let i = 0;
  let distance = 0;
  while(a[i] && b[i]) {
    distance += Math.sqrt((a[i].fCenter[0] - b[i].fCenter[0]) ** 2 + (a[i].fCenter[1] - b[i].fCenter[1]) ** 2);
    distance += Math.abs(a[i].fWidth - b[i].fWidth);
    distance += Math.abs(a[i].fHeight - b[i].fHeight);

    i++;
  }

  return distance;
};

const PrefixInput = getFeatures({
  "height": 74,
  "width": 610,
  "y": 17,
  "x": 21,
  "children": [
    {
      "height": 54,
      "width": 590,
      "y": 26,
      "x": 30
    },
    {
      "height": 31,
      "width": 139,
      "y": 39,
      "x": 85
    },
    {
      "height": 35,
      "width": 33,
      "y": 37,
      "x": 48
    }
  ]
});

const Checkbox = getFeatures({
  "height": 42,
  "width": 244,
  "y": 289,
  "x": 21,
  "children": [
    {
      "height": 31,
      "width": 194,
      "y": 295,
      "x": 71
    },
    {
      "height": 42,
      "width": 42,
      "y": 289,
      "x": 21
    },
    {
      "height": 3,
      "width": 3,
      "y": 318,
      "x": 30
    },
    {
      "height": 10,
      "width": 9,
      "y": 312,
      "x": 45
    },
    {
      "height": 8,
      "width": 24,
      "y": 298,
      "x": 30
    }
  ]
});

const Label = getFeatures({
  "height": 36,
  "width": 222,
  "y": 295,
  "x": 407,
  "children": [
    {
      "height": 35,
      "width": 130,
      "y": 295,
      "x": 499
    },
    {
      "height": 36,
      "width": 91,
      "y": 295,
      "x": 407
    }
  ]
});

const Button = getFeatures({
  "height": 74,
  "width": 610,
  "y": 353,
  "x": 21,
  "children": [
    {
      "height": 56,
      "width": 592,
      "y": 362,
      "x": 30
    },
    {
      "height": 37,
      "width": 84,
      "y": 374,
      "x": 284
    }
  ]
});

const componentFeature = {
  Button,
  Label,
  Checkbox,
  PrefixInput,
};

module.exports = {
  componentFeature,
  getFeatures,
  distanceBetween,
};