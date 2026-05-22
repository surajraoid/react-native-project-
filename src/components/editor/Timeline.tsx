import React, {useRef, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {Scene} from '../../types';
import {formatDurationFull} from '../../utils/formatters';
import {useVideoEditor} from '../../hooks/useVideoEditor';

const PIXELS_PER_SECOND = 80;
const TRACK_HEIGHT = 36;

export default function Timeline() {
  const {currentProject, editorState, setCurrentScene, totalDuration, sceneStartTime, setPlayback} = useVideoEditor();
  const scrollRef = useRef<ScrollView>(null);

  const totalWidth = (totalDuration / 1000) * PIXELS_PER_SECOND + 80;

  const handleScenePress = useCallback(
    (index: number) => {
      setCurrentScene(index);
      setPlayback(false, sceneStartTime(index));
    },
    [setCurrentScene, setPlayback, sceneStartTime],
  );

  if (!currentProject) {return null;}

  const playheadLeft = (editorState.playbackTime / 1000) * PIXELS_PER_SECOND + 40;

  return (
    <View style={styles.container}>
      {/* Track labels */}
      <View style={styles.labels}>
        <Text style={styles.trackLabel}>🎬 Scenes</Text>
        <Text style={styles.trackLabel}>🎵 Audio</Text>
        <Text style={styles.trackLabel}>✏️ Text</Text>
      </View>

      {/* Scrollable timeline */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{width: totalWidth}}>
        {/* Timecode ruler */}
        <View style={styles.ruler}>
          {Array.from({length: Math.ceil(totalDuration / 1000) + 1}).map((_, i) => (
            <View key={i} style={[styles.tick, {left: i * PIXELS_PER_SECOND + 40}]}>
              <Text style={styles.tickLabel}>{formatDurationFull(i * 1000)}</Text>
            </View>
          ))}
        </View>

        {/* Scene track */}
        <View style={[styles.track, {marginTop: 24}]}>
          {currentProject.scenes.map((scene, idx) => {
            const left = sceneStartTime(idx) / 1000 * PIXELS_PER_SECOND + 40;
            const width = Math.max(scene.duration / 1000 * PIXELS_PER_SECOND - 2, 20);
            const isActive = editorState.currentSceneIndex === idx;
            return (
              <TouchableOpacity
                key={scene.id}
                style={[
                  styles.sceneBlock,
                  {left, width},
                  isActive && styles.sceneBlockActive,
                ]}
                onPress={() => handleScenePress(idx)}
                activeOpacity={0.8}>
                <View
                  style={[
                    styles.sceneBlockFill,
                    {backgroundColor: isActive ? Colors.primary : Colors.cardElevated},
                  ]}
                />
                <Text style={styles.sceneBlockLabel} numberOfLines={1}>
                  {scene.name}
                </Text>
                <Text style={styles.sceneBlockDuration}>
                  {formatDurationFull(scene.duration)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Audio track */}
        <View style={[styles.track, {marginTop: TRACK_HEIGHT + 4}]}>
          {currentProject.scenes.map((scene, idx) =>
            scene.audioLayers.map(audio => {
              const left = (sceneStartTime(idx) + audio.startTime) / 1000 * PIXELS_PER_SECOND + 40;
              const width = Math.max(audio.duration / 1000 * PIXELS_PER_SECOND - 2, 10);
              const color = audio.type === 'music' ? Colors.trackMusic
                : audio.type === 'voice' ? Colors.trackVoice
                : audio.type === 'sfx' ? Colors.trackSFX
                : Colors.trackNarration;
              return (
                <View
                  key={audio.id}
                  style={[styles.audioBlock, {left, width, backgroundColor: color + '55'}]}>
                  <View style={[styles.audioBlockBorder, {backgroundColor: color}]} />
                  <Text style={styles.audioLabel} numberOfLines={1}>{audio.name}</Text>
                </View>
              );
            }),
          )}
        </View>

        {/* Text track */}
        <View style={[styles.track, {marginTop: (TRACK_HEIGHT + 4) * 2}]}>
          {currentProject.scenes.map((scene, idx) =>
            scene.textLayers.map(layer => {
              const baseLeft = sceneStartTime(idx) / 1000 * PIXELS_PER_SECOND + 40;
              const enterOffset = (layer.enterTime ?? 0) / 1000 * PIXELS_PER_SECOND;
              const layerWidth = Math.max((layer.duration ?? 2000) / 1000 * PIXELS_PER_SECOND - 2, 10);
              return (
                <View
                  key={layer.id}
                  style={[styles.textBlock, {left: baseLeft + enterOffset, width: layerWidth}]}>
                  <Text style={styles.textBlockLabel} numberOfLines={1}>{layer.text}</Text>
                </View>
              );
            }),
          )}
        </View>

        {/* Playhead */}
        <View style={[styles.playhead, {left: playheadLeft}]} pointerEvents="none">
          <View style={styles.playheadHandle} />
          <View style={styles.playheadLine} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
  },
  labels: {
    width: 56,
    paddingTop: 24 + 4,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    gap: 4,
  },
  trackLabel: {
    ...Typography.overline,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.xs,
    height: TRACK_HEIGHT,
    lineHeight: TRACK_HEIGHT,
    fontSize: 9,
  },
  ruler: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tick: {
    position: 'absolute',
    top: 0,
    height: 24,
    alignItems: 'center',
  },
  tickLabel: {
    ...Typography.overline,
    color: Colors.textMuted,
    fontSize: 9,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
  },
  sceneBlock: {
    position: 'absolute',
    height: TRACK_HEIGHT - 4,
    top: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
  },
  sceneBlockActive: {
    borderColor: Colors.primary,
    ...{shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4},
  },
  sceneBlockFill: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  sceneBlockLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
    fontWeight: '600',
  },
  sceneBlockDuration: {
    ...Typography.overline,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.xs,
    fontSize: 9,
  },
  audioBlock: {
    position: 'absolute',
    height: TRACK_HEIGHT - 4,
    top: 2,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  audioBlockBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  audioLabel: {
    ...Typography.overline,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
    fontSize: 9,
  },
  textBlock: {
    position: 'absolute',
    height: TRACK_HEIGHT - 4,
    top: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.accentTransparent10,
    borderWidth: 1,
    borderColor: Colors.accent,
    justifyContent: 'center',
  },
  textBlockLabel: {
    ...Typography.overline,
    color: Colors.accent,
    paddingHorizontal: Spacing.xs,
    fontSize: 9,
  },
  playhead: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    alignItems: 'center',
  },
  playheadHandle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    marginTop: 6,
  },
  playheadLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.secondary,
    opacity: 0.8,
  },
});
