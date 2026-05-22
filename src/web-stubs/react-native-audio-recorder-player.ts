export default class AudioRecorderPlayer {
  startRecorder = async (_path?: string) => _path ?? 'web-audio';
  stopRecorder = async () => 'web-audio';
  pauseRecorder = async () => {};
  resumeRecorder = async () => {};
  startPlayer = async (_path?: string) => {};
  stopPlayer = async () => {};
  pausePlayer = async () => {};
  resumePlayer = async () => {};
  seekToPlayer = async (_ms: number) => {};
  setVolume = async (_vol: number) => {};
  addRecordBackListener = (_cb: Function) => ({ remove: () => {} });
  addPlayBackListener = (_cb: Function) => ({ remove: () => {} });
  removeRecordBackObserver = () => {};
  removePlayBackObserver = () => {};
}
