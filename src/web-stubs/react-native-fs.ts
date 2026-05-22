const RNFS = {
  DocumentDirectoryPath: '/tmp',
  CachesDirectoryPath: '/tmp',
  ExternalDirectoryPath: '/tmp',
  TemporaryDirectoryPath: '/tmp',
  writeFile: async () => {},
  readFile: async () => '',
  exists: async () => false,
  unlink: async () => {},
  mkdir: async () => {},
  copyFile: async () => {},
  moveFile: async () => {},
  readDir: async () => [],
  stat: async () => ({ size: 0, isFile: () => true, isDirectory: () => false }),
};

export default RNFS;
