const DocumentPicker = {
  pick: async () => [],
  pickSingle: async () => null,
  pickMultiple: async () => [],
  types: {
    allFiles: '*/*',
    audio: 'audio/*',
    video: 'video/*',
    images: 'image/*',
  },
  isCancel: (err: any) => err && err.code === 'DOCUMENT_PICKER_CANCELED',
};

export default DocumentPicker;
