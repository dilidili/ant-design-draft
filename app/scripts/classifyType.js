const { componentFeature, getFeatures, distanceBetween } = require('./componentFeatures');

// classify form item type:
//  1. normalize and calculate feature points
//  2. get the distance
//  3. determine use which type
const classifyType = (contour) => {
  const features = getFeatures(contour);
  const featureDistance = Object.keys(componentFeature).map(component => ({
    component,
    distance: distanceBetween(componentFeature[component], features),
  })).sort((a, b) => a.distance - b.distance);

  contour.type = featureDistance[0].component;

  return contour;
};

module.exports = classifyType;