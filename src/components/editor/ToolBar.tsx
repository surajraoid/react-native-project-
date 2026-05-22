import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {Colors, Spacing, BorderRadius, Typography} from '../../theme';
import {EditorPanel} from '../../types';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useOrientation} from '../../hooks/useOrientation';

interface ToolItem {
  id: EditorPanel;
  emoji: string;
  label: string;
  isPro?: boolean;
}

const tools: ToolItem[] = [
  {id: 'scenes', emoji: '🎬', label: 'Scenes'},
  {id: 'characters', emoji: '🧑‍🎨', label: 'Characters'},
  {id: 'effects', emoji: '✨', label: 'Effects'},
  {id: 'audio', emoji: '🎵', label: 'Audio'},
  {id: 'text', emoji: '✏️', label: 'Text'},
  {id: 'stickers', emoji: '😂', label: 'Stickers'},
  {id: 'transitions', emoji: '🔄', label: 'Transitions'},
  {id: 'export', emoji: '📤', label: 'Export'},
];

interface ToolBarProps {
  onToolSelect?: (panel: EditorPanel) => void;
}

export default function ToolBar({onToolSelect}: ToolBarProps) {
  const {editorState, setActivePanel} = useVideoEditor();
  const {isLandscape} = useOrientation();

  const handleSelect = (panel: EditorPanel) => {
    setActivePanel(panel);
    onToolSelect?.(panel);
  };

  return (
    <View style={[styles.container, isLandscape ? styles.containerLandscape : styles.containerPortrait]}>
      <ScrollView
        horizontal={!isLandscape}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isLandscape && styles.scrollContentVertical,
        ]}>
        {tools.map(tool => {
          const isActive = editorState.activePanel === tool.id;
          return (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolBtn, isActive && styles.toolBtnActive]}
              onPress={() => handleSelect(tool.id)}
              activeOpacity={0.75}>
              <Text style={styles.toolEmoji}>{tool.emoji}</Text>
              <Text style={[styles.toolLabel, isActive && styles.toolLabelActive]}>
                {tool.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  containerPortrait: {
    borderTopWidth: 1,
    height: 72,
  },
  containerLandscape: {
    borderRightWidth: 1,
    width: 72,
    paddingVertical: Spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs2,
  },
  scrollContentVertical: {
    flexDirection: 'column',
    paddingHorizontal: 0,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs2,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minWidth: 60,
    position: 'relative',
  },
  toolBtnActive: {
    backgroundColor: Colors.primaryTransparent20,
  },
  toolEmoji: {
    fontSize: 20,
  },
  toolLabel: {
    ...Typography.overline,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 9,
    textAlign: 'center',
  },
  toolLabelActive: {
    color: Colors.primary,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
