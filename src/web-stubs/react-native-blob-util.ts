const RNBlobUtil = {
  config: (_opts: any) => ({
    fetch: async (_method: string, _url: string) => ({
      path: () => '',
      data: '',
      info: () => ({ status: 200 }),
    }),
  }),
  fs: {
    exists: async () => false,
    unlink: async () => {},
    dirs: { DocumentDir: '/tmp', CacheDir: '/tmp' },
  },
  android: { actionViewIntent: async () => {} },
  ios: { previewDocument: async () => {}, openDocument: async () => {} },
};

export default RNBlobUtil;
