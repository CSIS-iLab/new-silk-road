const defaultZoom = 2.0;
const minDetailZoom = 5.0;
const maxFitZoom = 10.0;
const onMoveDelayTime = 750;
const updateInterval = 500;
const boundsPadding = 15;
const popContentClass = 'popup-content';
const defaultCenter = [88.639973, 32.776942];
const validInfrastructureTypes = [
  'Intermodal',
  'Powerplant',
  'Rail',
  'Road',
  'Seaport',
];

export {
  defaultZoom,
  minDetailZoom,
  maxFitZoom,
  onMoveDelayTime,
  boundsPadding,
  updateInterval,
  popContentClass,
  defaultCenter,
  validInfrastructureTypes,
};
