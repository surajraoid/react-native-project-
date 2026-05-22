const Orientation = {
  lockToPortrait: () => {},
  lockToLandscape: () => {},
  lockToLandscapeLeft: () => {},
  lockToLandscapeRight: () => {},
  unlockAllOrientations: () => {},
  getOrientation: (cb: Function) => cb('PORTRAIT'),
  getDeviceOrientation: (cb: Function) => cb('PORTRAIT'),
  addOrientationListener: (_cb: Function) => {},
  removeOrientationListener: (_cb: Function) => {},
  addDeviceOrientationListener: (_cb: Function) => {},
  removeDeviceOrientationListener: (_cb: Function) => {},
};

export default Orientation;
