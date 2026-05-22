import React, {useState, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {RootStackParams} from '../../navigation/types';
import {useProjectStore} from '../../store/useProjectStore';
import {useOrientation} from '../../hooks/useOrientation';
import Canvas from '../../components/editor/Canvas';
import Timeline from '../../components/editor/Timeline';
import ToolBar from '../../components/editor/ToolBar';
import EffectsPanel from '../../components/editor/EffectsPanel';
import AudioPanel from '../../components/editor/AudioPanel';
import TextPanel from '../../components/editor/TextPanel';
import CharacterPanel from '../../components/editor/CharacterPanel';
import StickersPanel from '../../components/editor/StickersPanel';
import TransitionsPanel from '../../components/editor/TransitionsPanel';
import {EditorPanel} from '../../types';
import {formatTimecode} from '../../utils/formatters';
import {useVideoEditor} from '../../hooks/useVideoEditor';

type EditorRoute = RouteProp<RootStackParams, 'Editor'>;

const PANEL_COMPONENTS: Partial<Record<EditorPanel, React.ComponentType>> = {
  effects: EffectsPanel,
  audio: AudioPanel,
  text: TextPanel,
  characters: CharacterPanel,
  stickers: StickersPanel,
  transitions: TransitionsPanel,
};

export default function EditorScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditorRoute>();
  const {openProject, closeProject} = useProjectStore();
  const {isLandscape, width, height} = useOrientation();
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const {
    currentProject,
    editorState,
    setPlayback,
    undo,
    redo,
    addScene,
    totalDuration,
  } = useVideoEditor();

  useLayoutEffect(() => {
    openProject(route.params.projectId);
    return () => {};
  }, [route.params.projectId, openProject]);

  const {width: winWidth} = useWindowDimensions();

  const canvasPanelWidth = isLandscape
    ? winWidth - (isPanelVisible ? 280 : 0) - 72
    : winWidth;

  const canvasContainerW = isLandscape ? canvasPanelWidth : winWidth;
  const canvasW = canvasContainerW - Spacing.md * 2;

  const handleClose = useCallback(() => {
    closeProject();
    navigation.goBack();
  }, [closeProject, navigation]);

  const handleToolSelect = (panel: EditorPanel) => {
    if (PANEL_COMPONENTS[panel]) {
      setIsPanelVisible(true);
    } else {
      setIsPanelVisible(false);
    }
  };

  const ActivePanel = PANEL_COMPONENTS[editorState.activePanel];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarBtn} onPress={handleClose}>
          <Text style={styles.topBarBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.projectName} numberOfLines={1}>
            {currentProject?.name ?? 'Editor'}
          </Text>
          <Text style={styles.timecode}>
            {formatTimecode(editorState.playbackTime)} / {formatTimecode(totalDuration)}
          </Text>
        </View>

        <View style={styles.topBarRight}>
          {/* Undo */}
          <TouchableOpacity
            style={[styles.topBarIconBtn, editorState.undoStack.length === 0 && styles.topBarBtnDisabled]}
            onPress={undo}
            disabled={editorState.undoStack.length === 0}>
            <Text style={styles.topBarIconText}>↩</Text>
          </TouchableOpacity>
          {/* Redo */}
          <TouchableOpacity
            style={[styles.topBarIconBtn, editorState.redoStack.length === 0 && styles.topBarBtnDisabled]}
            onPress={redo}
            disabled={editorState.redoStack.length === 0}>
            <Text style={styles.topBarIconText}>↪</Text>
          </TouchableOpacity>
          {/* Export */}
          <TouchableOpacity style={styles.exportBtn}>
            <LinearGradient
              colors={Colors.gradientPrimary as unknown as string[]}
              style={styles.exportBtnGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.exportBtnText}>Export</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main editor layout */}
      {isLandscape ? (
        <LandscapeLayout
          canvasWidth={canvasW}
          isPanelVisible={isPanelVisible}
          setIsPanelVisible={setIsPanelVisible}
          ActivePanel={ActivePanel}
          onToolSelect={handleToolSelect}
        />
      ) : (
        <PortraitLayout
          canvasWidth={canvasW}
          isPanelVisible={isPanelVisible}
          setIsPanelVisible={setIsPanelVisible}
          ActivePanel={ActivePanel}
          onToolSelect={handleToolSelect}
        />
      )}
    </View>
  );
}

function PortraitLayout({
  canvasWidth,
  isPanelVisible,
  setIsPanelVisible,
  ActivePanel,
  onToolSelect,
}: {
  canvasWidth: number;
  isPanelVisible: boolean;
  setIsPanelVisible: (v: boolean) => void;
  ActivePanel?: React.ComponentType;
  onToolSelect: (panel: EditorPanel) => void;
}) {
  const {editorState, setPlayback, addScene} = useVideoEditor();

  return (
    <View style={styles.portraitLayout}>
      {/* Canvas area */}
      <View style={styles.canvasArea}>
        <View style={styles.canvasPadding}>
          <Canvas containerWidth={canvasWidth} />
        </View>

        {/* Scene strip */}
        <SceneStrip />
      </View>

      {/* Panel (slides up over timeline) */}
      {isPanelVisible && ActivePanel && (
        <View style={styles.panelPortrait}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{getPanelTitle(editorState.activePanel)}</Text>
            <TouchableOpacity onPress={() => setIsPanelVisible(false)}>
              <Text style={styles.panelClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ActivePanel />
        </View>
      )}

      {/* Timeline */}
      {!isPanelVisible && <Timeline />}

      {/* Toolbar */}
      <ToolBar onToolSelect={onToolSelect} />
    </View>
  );
}

function LandscapeLayout({
  canvasWidth,
  isPanelVisible,
  setIsPanelVisible,
  ActivePanel,
  onToolSelect,
}: {
  canvasWidth: number;
  isPanelVisible: boolean;
  setIsPanelVisible: (v: boolean) => void;
  ActivePanel?: React.ComponentType;
  onToolSelect: (panel: EditorPanel) => void;
}) {
  const {editorState} = useVideoEditor();

  return (
    <View style={styles.landscapeLayout}>
      {/* Left: Toolbar */}
      <ToolBar onToolSelect={onToolSelect} />

      {/* Center: Canvas + Timeline */}
      <View style={styles.landscapeCenter}>
        <View style={styles.canvasPadding}>
          <Canvas containerWidth={canvasWidth} />
        </View>
        <SceneStrip />
        <Timeline />
      </View>

      {/* Right: Panel */}
      {isPanelVisible && ActivePanel && (
        <View style={styles.panelLandscape}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{getPanelTitle(editorState.activePanel)}</Text>
            <TouchableOpacity onPress={() => setIsPanelVisible(false)}>
              <Text style={styles.panelClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ActivePanel />
        </View>
      )}
    </View>
  );
}

function SceneStrip() {
  const {currentProject, editorState, setCurrentScene, addScene, deleteScene} = useVideoEditor();

  if (!currentProject) {return null;}

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.sceneStrip}
      contentContainerStyle={styles.sceneStripContent}>
      {currentProject.scenes.map((scene, idx) => {
        const isActive = editorState.currentSceneIndex === idx;
        return (
          <TouchableOpacity
            key={scene.id}
            style={[styles.sceneThumb, isActive && styles.sceneThumbActive]}
            onPress={() => setCurrentScene(idx)}>
            <LinearGradient
              colors={['#1A1A35', '#0A0A1A']}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.sm}
            />
            <Text style={styles.sceneThumbNum}>{idx + 1}</Text>
            <Text style={styles.sceneThumbName} numberOfLines={1}>{scene.name}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.addSceneBtn} onPress={addScene}>
        <Text style={styles.addSceneBtnText}>+</Text>
        <Text style={styles.addSceneBtnLabel}>Add Scene</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getPanelTitle(panel: EditorPanel): string {
  const map: Record<EditorPanel, string> = {
    scenes: 'Scenes',
    characters: 'Characters',
    effects: 'Effects',
    audio: 'Audio',
    text: 'Text',
    stickers: 'Stickers',
    transitions: 'Transitions',
    export: 'Export',
    settings: 'Settings',
  };
  return map[panel] ?? panel;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  topBarBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card,
  },
  topBarBtnText: {color: Colors.textPrimary, fontSize: 16, fontWeight: '700'},
  topBarCenter: {flex: 1, alignItems: 'center'},
  projectName: {...Typography.h6, color: Colors.textPrimary},
  timecode: {...Typography.mono, color: Colors.textMuted, fontSize: 11, marginTop: 1},
  topBarRight: {flexDirection: 'row', alignItems: 'center', gap: Spacing.xs},
  topBarIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.card,
  },
  topBarBtnDisabled: {opacity: 0.4},
  topBarIconText: {color: Colors.textPrimary, fontSize: 16},
  exportBtn: {borderRadius: BorderRadius.full, overflow: 'hidden'},
  exportBtnGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  exportBtnText: {...Typography.buttonSmall, color: Colors.white},
  portraitLayout: {flex: 1, flexDirection: 'column'},
  landscapeLayout: {flex: 1, flexDirection: 'row'},
  landscapeCenter: {flex: 1},
  canvasArea: {flex: 1},
  canvasPadding: {padding: Spacing.md, flex: 1, alignItems: 'center', justifyContent: 'center'},
  panelPortrait: {
    height: '50%',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  panelLandscape: {
    width: 280,
    backgroundColor: Colors.surface,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  panelTitle: {...Typography.h6, color: Colors.textPrimary},
  panelClose: {color: Colors.textMuted, fontSize: 16, padding: Spacing.xs},
  sceneStrip: {
    height: 72,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexGrow: 0,
  },
  sceneStripContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  sceneThumb: {
    width: 80,
    height: 54,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sceneThumbActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  sceneThumbNum: {
    ...Typography.overline,
    color: Colors.textMuted,
    fontSize: 9,
  },
  sceneThumbName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  addSceneBtn: {
    width: 60,
    height: 54,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: Colors.primaryTransparent10,
  },
  addSceneBtnText: {color: Colors.primary, fontSize: 20, fontWeight: '700', lineHeight: 24},
  addSceneBtnLabel: {...Typography.overline, color: Colors.primary, fontSize: 9},
});
