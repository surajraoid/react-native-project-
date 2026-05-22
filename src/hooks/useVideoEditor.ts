import {useCallback, useRef} from 'react';
import {useProjectStore} from '../store/useProjectStore';
import {Scene, Character, TextLayer, AudioLayer, Sticker} from '../types';

export function useVideoEditor() {
  const store = useProjectStore();
  const {currentProject, editorState} = store;
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const currentScene: Scene | null =
    currentProject?.scenes[editorState.currentSceneIndex] ?? null;

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {clearTimeout(autoSaveTimer.current);}
    autoSaveTimer.current = setTimeout(() => {
      store.saveProjects();
    }, 2000);
  }, [store]);

  const withUndoPush = useCallback(
    (action: () => void) => {
      store.pushToUndoStack();
      action();
      scheduleAutoSave();
    },
    [store, scheduleAutoSave],
  );

  const addCharacterToCurrentScene = useCallback(
    (character: Omit<Character, 'id'>) => {
      if (!currentScene) {return;}
      withUndoPush(() => store.addCharacter(currentScene.id, character));
    },
    [currentScene, store, withUndoPush],
  );

  const addTextToCurrentScene = useCallback(
    (textLayer: Omit<TextLayer, 'id'>) => {
      if (!currentScene) {return;}
      withUndoPush(() => store.addTextLayer(currentScene.id, textLayer));
    },
    [currentScene, store, withUndoPush],
  );

  const addAudioToCurrentScene = useCallback(
    (audio: Omit<AudioLayer, 'id'>) => {
      if (!currentScene) {return;}
      withUndoPush(() => store.addAudioLayer(currentScene.id, audio));
    },
    [currentScene, store, withUndoPush],
  );

  const addStickerToCurrentScene = useCallback(
    (sticker: Omit<Sticker, 'id'>) => {
      if (!currentScene) {return;}
      withUndoPush(() => store.addSticker(currentScene.id, sticker));
    },
    [currentScene, store, withUndoPush],
  );

  const totalDuration = currentProject?.scenes.reduce((sum, s) => sum + s.duration, 0) ?? 0;

  const sceneStartTime = useCallback(
    (sceneIndex: number): number => {
      if (!currentProject) {return 0;}
      return currentProject.scenes
        .slice(0, sceneIndex)
        .reduce((sum, s) => sum + s.duration, 0);
    },
    [currentProject],
  );

  const getSceneAtTime = useCallback(
    (timeMs: number): {scene: Scene; sceneIndex: number} | null => {
      if (!currentProject) {return null;}
      let elapsed = 0;
      for (let i = 0; i < currentProject.scenes.length; i++) {
        const scene = currentProject.scenes[i];
        if (timeMs >= elapsed && timeMs < elapsed + scene.duration) {
          return {scene, sceneIndex: i};
        }
        elapsed += scene.duration;
      }
      return null;
    },
    [currentProject],
  );

  return {
    currentProject,
    currentScene,
    editorState,
    totalDuration,
    addCharacterToCurrentScene,
    addTextToCurrentScene,
    addAudioToCurrentScene,
    addStickerToCurrentScene,
    sceneStartTime,
    getSceneAtTime,
    withUndoPush,
    // Re-export store actions
    selectElement: store.selectElement,
    setPlayback: store.setPlayback,
    setZoom: store.setZoom,
    setActivePanel: store.setActivePanel,
    undo: store.undo,
    redo: store.redo,
    addScene: store.addScene,
    deleteScene: store.deleteScene,
    updateScene: store.updateScene,
    setCurrentScene: store.setCurrentScene,
  };
}
