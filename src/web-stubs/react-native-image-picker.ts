export const launchImageLibrary = async (_options: any, callback?: Function) => {
  const result = { assets: null, didCancel: true };
  if (callback) { callback(result); }
  return result;
};

export const launchCamera = async (_options: any, callback?: Function) => {
  const result = { assets: null, didCancel: true };
  if (callback) { callback(result); }
  return result;
};
