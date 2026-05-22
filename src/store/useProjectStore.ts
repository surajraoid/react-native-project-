import {create} from 'zustand';
import {Project, Scene, EditorState, Character, TextLayer, AudioLayer, Sticker, Effect} from '../types';
import {generateId} from '../utils/helpers';
import {STORAGE_KEYS, EDITOR} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  editorState: EditorState;
  isEditorOpen: boolean;

  loadProjects: () => Promise<void>;
  saveProjects: () => Promise<void>;
  createProject: (name: string, aspectRatio: Project['aspectRatio'], style: Project['style']) => Project;
  openProject: (id: string) => void;
  closeProject: () => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateProjectName: (id: string, name: string) => void;

  // Scene operations
  addScene: () => void;
  deleteScene: (sceneId: string) => void;
  duplicateScene: (sceneId: string) => void;
  reorderScenes: (from: number, to: number) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  setCurrentScene: (index: number) => void;

  // Element operations
  addCharacter: (sceneId: string, character: Omit<Character, 'id'>) => void;
  updateCharacter: (sceneId: string, charId: string, updates: Partial<Character>) => void;
  removeCharacter: (sceneId: string, charId: string) => void;
  addTextLayer: (sceneId: string, textLayer: Omit<TextLayer, 'id'>) => void;
  updateTextLayer: (sceneId: string, layerId: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (sceneId: string, layerId: string) => void;
  addSticker: (sceneId: string, sticker: Omit<Sticker, 'id'>) => void;
  removeSticker: (sceneId: string, stickerId: string) => void;
  addAudioLayer: (sceneId: string, audio: Omit<AudioLayer, 'id'>) => void;
  updateAudioLayer: (sceneId: string, audioId: string, updates: Partial<AudioLayer>) => void;
  removeAudioLayer: (sceneId: string, audioId: string) => void;
  addEffect: (sceneId: string, effect: Omit<Effect, 'id'>) => void;
  removeEffect: (sceneId: string, effectId: string) => void;

  // Editor state
  selectElement: (id: string | null, type: EditorState['selectedElementType']) => void;
  setPlayback: (isPlaying: boolean, time?: number) => void;
  setZoom: (zoom: number) => void;
  setActivePanel: (panel: EditorState['activePanel']) => void;
  setVolume: (volume: number) => void;
  undo: () => void;
  redo: () => void;
  pushToUndoStack: () => void;
}

const defaultEditorState: EditorState = {
  projectId: null,
  currentSceneIndex: 0,
  selectedElementId: null,
  selectedElementType: null,
  playbackTime: 0,
  isPlaying: false,
  isMuted: false,
  volume: 1,
  zoom: 1,
  isRecording: false,
  activePanel: 'scenes',
  undoStack: [],
  redoStack: [],
  isDirty: false,
};

function createDefaultScene(index: number): Scene {
  return {
    id: generateId(),
    name: `Scene ${index + 1}`,
    duration: EDITOR.DEFAULT_SCENE_DURATION,
    background: {type: 'gradient', gradient: {colors: ['#1A1A35', '#0A0A1A'], angle: 135}},
    characters: [],
    textLayers: [],
    stickers: [],
    audioLayers: [],
    effects: [],
    transition: 'fade',
    transitionDuration: 500,
  };
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  editorState: defaultEditorState,
  isEditorOpen: false,

  loadProjects: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (json) {set({projects: JSON.parse(json)});}
    } catch {}
  },

  saveProjects: async () => {
    const {projects} = get();
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  createProject: (name, aspectRatio, style) => {
    const project: Project = {
      id: generateId(),
      name,
      duration: EDITOR.DEFAULT_SCENE_DURATION,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: [createDefaultScene(0)],
      aspectRatio,
      style,
      fps: 30,
      exportQuality: '1080p',
      tags: [],
      isFavorite: false,
      isShared: false,
    };
    set(state => ({projects: [project, ...state.projects]}));
    get().saveProjects();
    return project;
  },

  openProject: id => {
    const project = get().projects.find(p => p.id === id) || null;
    set({
      currentProject: project,
      isEditorOpen: true,
      editorState: {
        ...defaultEditorState,
        projectId: id,
      },
    });
  },

  closeProject: () => {
    get().saveProjects();
    set({currentProject: null, isEditorOpen: false, editorState: defaultEditorState});
  },

  deleteProject: id => {
    set(state => ({projects: state.projects.filter(p => p.id !== id)}));
    get().saveProjects();
  },

  duplicateProject: id => {
    const src = get().projects.find(p => p.id === id);
    if (!src) {return;}
    const copy: Project = {
      ...JSON.parse(JSON.stringify(src)),
      id: generateId(),
      name: `${src.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({projects: [copy, ...state.projects]}));
    get().saveProjects();
  },

  toggleFavorite: id => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? {...p, isFavorite: !p.isFavorite, updatedAt: new Date().toISOString()} : p,
      ),
    }));
    get().saveProjects();
  },

  updateProjectName: (id, name) => {
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? {...p, name, updatedAt: new Date().toISOString()} : p,
      ),
      currentProject:
        state.currentProject?.id === id
          ? {...state.currentProject, name}
          : state.currentProject,
    }));
  },

  addScene: () => {
    const {currentProject} = get();
    if (!currentProject) {return;}
    const newScene = createDefaultScene(currentProject.scenes.length);
    const updated = {
      ...currentProject,
      scenes: [...currentProject.scenes, newScene],
      updatedAt: new Date().toISOString(),
    };
    set(state => ({
      currentProject: updated,
      projects: state.projects.map(p => (p.id === updated.id ? updated : p)),
      editorState: {...state.editorState, currentSceneIndex: updated.scenes.length - 1, isDirty: true},
    }));
  },

  deleteScene: sceneId => {
    const {currentProject, editorState} = get();
    if (!currentProject || currentProject.scenes.length <= 1) {return;}
    const scenes = currentProject.scenes.filter(s => s.id !== sceneId);
    const updated = {...currentProject, scenes, updatedAt: new Date().toISOString()};
    const newIndex = Math.min(editorState.currentSceneIndex, scenes.length - 1);
    set(state => ({
      currentProject: updated,
      projects: state.projects.map(p => (p.id === updated.id ? updated : p)),
      editorState: {...state.editorState, currentSceneIndex: newIndex, isDirty: true},
    }));
  },

  duplicateScene: sceneId => {
    const {currentProject} = get();
    if (!currentProject) {return;}
    const idx = currentProject.scenes.findIndex(s => s.id === sceneId);
    if (idx === -1) {return;}
    const copy: Scene = {...JSON.parse(JSON.stringify(currentProject.scenes[idx])), id: generateId()};
    const scenes = [...currentProject.scenes.slice(0, idx + 1), copy, ...currentProject.scenes.slice(idx + 1)];
    const updated = {...currentProject, scenes, updatedAt: new Date().toISOString()};
    set(state => ({
      currentProject: updated,
      projects: state.projects.map(p => (p.id === updated.id ? updated : p)),
      editorState: {...state.editorState, isDirty: true},
    }));
  },

  reorderScenes: (from, to) => {
    const {currentProject} = get();
    if (!currentProject) {return;}
    const scenes = [...currentProject.scenes];
    const [moved] = scenes.splice(from, 1);
    scenes.splice(to, 0, moved);
    const updated = {...currentProject, scenes, updatedAt: new Date().toISOString()};
    set(state => ({
      currentProject: updated,
      projects: state.projects.map(p => (p.id === updated.id ? updated : p)),
      editorState: {...state.editorState, currentSceneIndex: to, isDirty: true},
    }));
  },

  updateScene: (sceneId, updates) => {
    const {currentProject} = get();
    if (!currentProject) {return;}
    const scenes = currentProject.scenes.map(s => (s.id === sceneId ? {...s, ...updates} : s));
    const updated = {...currentProject, scenes, updatedAt: new Date().toISOString()};
    set(state => ({
      currentProject: updated,
      projects: state.projects.map(p => (p.id === updated.id ? updated : p)),
      editorState: {...state.editorState, isDirty: true},
    }));
  },

  setCurrentScene: index => set(state => ({editorState: {...state.editorState, currentSceneIndex: index}})),

  addCharacter: (sceneId, character) => {
    const char: Character = {...character, id: generateId()};
    get().updateScene(sceneId, {
      characters: [...(get().currentProject?.scenes.find(s => s.id === sceneId)?.characters ?? []), char],
    });
  },

  updateCharacter: (sceneId, charId, updates) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {
      characters: scene.characters.map(c => (c.id === charId ? {...c, ...updates} : c)),
    });
  },

  removeCharacter: (sceneId, charId) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {characters: scene.characters.filter(c => c.id !== charId)});
  },

  addTextLayer: (sceneId, textLayer) => {
    const layer: TextLayer = {...textLayer, id: generateId()};
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {textLayers: [...scene.textLayers, layer]});
  },

  updateTextLayer: (sceneId, layerId, updates) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {
      textLayers: scene.textLayers.map(l => (l.id === layerId ? {...l, ...updates} : l)),
    });
  },

  removeTextLayer: (sceneId, layerId) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {textLayers: scene.textLayers.filter(l => l.id !== layerId)});
  },

  addSticker: (sceneId, sticker) => {
    const s: Sticker = {...sticker, id: generateId()};
    const scene = get().currentProject?.scenes.find(sc => sc.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {stickers: [...scene.stickers, s]});
  },

  removeSticker: (sceneId, stickerId) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {stickers: scene.stickers.filter(s => s.id !== stickerId)});
  },

  addAudioLayer: (sceneId, audio) => {
    const layer: AudioLayer = {...audio, id: generateId()};
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {audioLayers: [...scene.audioLayers, layer]});
  },

  updateAudioLayer: (sceneId, audioId, updates) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {
      audioLayers: scene.audioLayers.map(a => (a.id === audioId ? {...a, ...updates} : a)),
    });
  },

  removeAudioLayer: (sceneId, audioId) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {audioLayers: scene.audioLayers.filter(a => a.id !== audioId)});
  },

  addEffect: (sceneId, effect) => {
    const e: Effect = {...effect, id: generateId()};
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {effects: [...scene.effects, e]});
  },

  removeEffect: (sceneId, effectId) => {
    const scene = get().currentProject?.scenes.find(s => s.id === sceneId);
    if (!scene) {return;}
    get().updateScene(sceneId, {effects: scene.effects.filter(e => e.id !== effectId)});
  },

  selectElement: (id, type) =>
    set(state => ({editorState: {...state.editorState, selectedElementId: id, selectedElementType: type}})),

  setPlayback: (isPlaying, time) =>
    set(state => ({
      editorState: {
        ...state.editorState,
        isPlaying,
        ...(time !== undefined ? {playbackTime: time} : {}),
      },
    })),

  setZoom: zoom =>
    set(state => ({editorState: {...state.editorState, zoom}})),

  setActivePanel: panel =>
    set(state => ({editorState: {...state.editorState, activePanel: panel}})),

  setVolume: volume =>
    set(state => ({editorState: {...state.editorState, volume}})),

  pushToUndoStack: () => {
    const {currentProject, editorState} = get();
    if (!currentProject) {return;}
    const snapshot = JSON.stringify(currentProject);
    const undoStack = [snapshot, ...editorState.undoStack].slice(0, EDITOR.MAX_UNDO_STEPS);
    set(state => ({editorState: {...state.editorState, undoStack, redoStack: []}}));
  },

  undo: () => {
    const {editorState} = get();
    if (editorState.undoStack.length === 0) {return;}
    const [prev, ...rest] = editorState.undoStack;
    const project = JSON.parse(prev) as Project;
    set(state => ({
      currentProject: project,
      projects: state.projects.map(p => (p.id === project.id ? project : p)),
      editorState: {...state.editorState, undoStack: rest, redoStack: [JSON.stringify(state.currentProject), ...state.editorState.redoStack]},
    }));
  },

  redo: () => {
    const {editorState, currentProject} = get();
    if (editorState.redoStack.length === 0) {return;}
    const [next, ...rest] = editorState.redoStack;
    const project = JSON.parse(next) as Project;
    set(state => ({
      currentProject: project,
      projects: state.projects.map(p => (p.id === project.id ? project : p)),
      editorState: {
        ...state.editorState,
        redoStack: rest,
        undoStack: [JSON.stringify(currentProject), ...state.editorState.undoStack],
      },
    }));
  },
}));
