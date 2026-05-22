import React, {useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useOrientation} from '../../hooks/useOrientation';
import {getCanvasDimensions} from '../../utils/helpers';

interface CanvasProps {
  containerWidth: number;
}

export default function Canvas({containerWidth}: CanvasProps) {
  const {currentProject, currentScene, editorState, setPlayback, selectElement} = useVideoEditor();
  const {isLandscape} = useOrientation();

  const ratio = currentProject?.aspectRatio ?? '16:9';
  const dims = getCanvasDimensions(ratio, containerWidth);

  const handlePlayPause = useCallback(() => {
    setPlayback(!editorState.isPlaying);
  }, [editorState.isPlaying, setPlayback]);

  const handleCanvasTap = useCallback(() => {
    selectElement(null, null);
  }, [selectElement]);

  const getBgStyle = () => {
    if (!currentScene) {return {backgroundColor: Colors.background};}
    const {background} = currentScene;
    if (background.type === 'color' && background.color) {
      return {backgroundColor: background.color};
    }
    return {};
  };

  const isGradientBg =
    currentScene?.background.type === 'gradient' && currentScene.background.gradient;

  if (!currentProject) {
    return (
      <View style={[styles.emptyCanvas, {width: containerWidth, height: containerWidth * 0.5625}]}>
        <Text style={styles.emptyText}>No project open</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, {width: dims.width, height: dims.height}]}>
      {/* Background */}
      <TouchableOpacity
        style={[styles.canvas, getBgStyle()]}
        activeOpacity={1}
        onPress={handleCanvasTap}>
        {isGradientBg && (
          <LinearGradient
            colors={currentScene!.background.gradient!.colors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Characters */}
        {currentScene?.characters.map(char => (
          <TouchableOpacity
            key={char.id}
            style={[
              styles.character,
              {
                left: `${char.transform.position.x * 100}%`,
                top: `${char.transform.position.y * 100}%`,
                transform: [
                  {scale: char.transform.scale},
                  {rotate: `${char.transform.rotation}deg`},
                ],
              },
            ]}
            onPress={() => selectElement(char.id, 'character')}>
            <Text style={styles.characterEmoji}>🧑‍🎨</Text>
            {char.dialogueText ? (
              <View style={styles.speechBubble}>
                <Text style={styles.speechText} numberOfLines={3}>{char.dialogueText}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ))}

        {/* Text layers */}
        {currentScene?.textLayers.map(layer => (
          <TouchableOpacity
            key={layer.id}
            style={[
              styles.textLayer,
              {
                left: `${layer.transform.position.x * 100}%`,
                top: `${layer.transform.position.y * 100}%`,
              },
            ]}
            onPress={() => selectElement(layer.id, 'text')}>
            <Text
              style={{
                color: layer.style.color,
                fontSize: layer.style.fontSize,
                fontWeight: layer.style.fontWeight,
                fontStyle: layer.style.italic ? 'italic' : 'normal',
                textShadowColor: layer.style.shadowColor ?? 'transparent',
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: layer.style.shadowRadius ?? 0,
              }}>
              {layer.text}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Stickers */}
        {currentScene?.stickers.map(sticker => (
          <TouchableOpacity
            key={sticker.id}
            style={[
              styles.stickerLayer,
              {
                left: `${sticker.transform.position.x * 100}%`,
                top: `${sticker.transform.position.y * 100}%`,
                transform: [{scale: sticker.transform.scale}],
              },
            ]}
            onPress={() => selectElement(sticker.id, 'sticker')}>
            <Text style={{fontSize: 48}}>✨</Text>
          </TouchableOpacity>
        ))}

        {/* Watermark for free tier */}
        <View style={styles.watermark} pointerEvents="none">
          <Text style={styles.watermarkText}>ToonCraft Pro</Text>
        </View>
      </TouchableOpacity>

      {/* Canvas overlay controls */}
      <View style={styles.canvasOverlay} pointerEvents="box-none">
        {/* Play/Pause button */}
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.playBtnGradient}>
            <Text style={styles.playBtnEmoji}>{editorState.isPlaying ? '⏸' : '▶️'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Canvas border glow when playing */}
      {editorState.isPlaying && (
        <View style={styles.playingBorder} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  canvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  emptyCanvas: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  character: {
    position: 'absolute',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 64,
  },
  speechBubble: {
    position: 'absolute',
    bottom: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    maxWidth: 160,
    minWidth: 60,
    ...{shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4},
  },
  speechText: {
    color: Colors.textInverse,
    fontSize: 11,
    lineHeight: 16,
  },
  textLayer: {
    position: 'absolute',
  },
  stickerLayer: {
    position: 'absolute',
  },
  watermark: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  watermarkText: {
    ...Typography.overline,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: Spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    ...{shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8},
  },
  playBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnEmoji: {
    fontSize: 18,
  },
  playingBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...{shadowColor: Colors.primary, shadowOpacity: 0.8, shadowRadius: 12, elevation: 0},
  },
});
