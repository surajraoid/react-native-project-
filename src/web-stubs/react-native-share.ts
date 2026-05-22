const Share = {
  open: async (options: any) => {
    if (navigator.share && options.url) {
      await navigator.share({ title: options.title, url: options.url });
    }
    return { success: true };
  },
  shareSingle: async () => ({ success: true }),
};

export default Share;
